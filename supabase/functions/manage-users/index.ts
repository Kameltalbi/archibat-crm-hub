import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  return null
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing')
    }
    
    const { action, data } = await req.json()
    
    // Vérifier l'authentification de l'admin requérant
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token')
    }
    
    // Vérifier si l'utilisateur est un admin
    let isAdmin = false;
    
    // Vérification habituelle des rôles d'administrateur
    const { data: userRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()
    
    if (userRoles) {
      isAdmin = true;
    } else {
      // Si aucun admin n'existe encore dans le système, considérer cet utilisateur comme le premier admin
      const { count, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');
      
      if (!countError && count === 0) {
        // C'est le premier utilisateur, on lui accorde les droits d'admin
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });
        
        if (!insertError) {
          isAdmin = true;
          console.log("Premier utilisateur promu administrateur:", user.id);
        }
      }
    }
    
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin privileges required')
    }
    
    let result
    
    switch (action) {
      case 'CREATE_USER':
        const { email, password, name, role: userRole } = data
        
        // Créer l'utilisateur
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name }
        })
        
        if (createError) throw createError
        
        // Ajouter le rôle
        if (userData.user) {
          const { error: roleInsertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userData.user.id,
              role: userRole
            })
          
          if (roleInsertError) throw roleInsertError
          
          result = {
            id: userData.user.id,
            name,
            email,
            role: userRole,
            status: "active"
          }
        }
        break
        
      case 'LIST_USERS':
        // Récupérer tous les utilisateurs
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
        
        if (usersError) throw usersError
        
        // Récupérer les rôles
        const { data: rolesData, error: rolesListError } = await supabase
          .from('user_roles')
          .select('*')
        
        if (rolesListError) throw rolesListError
        
        // Fusionner les données
        result = usersData.users.map(user => {
          const userRole = rolesData?.find(role => role.user_id === user.id)
          return {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur',
            email: user.email || '',
            role: userRole?.role || 'lecture_seule',
            status: user.email_confirmed_at ? "active" : "pending"
          }
        })
        break
        
      case 'DELETE_USER':
        const { userId } = data
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        
        if (deleteError) throw deleteError
        
        result = { success: true }
        break
        
      // Ajout du cas pour gérer les permissions
      case 'GET_PERMISSIONS':
        // Récupérer toutes les permissions
        const { data: permissions, error: permissionsError } = await supabase
          .from('role_permissions')
          .select('*')
        
        if (permissionsError) throw permissionsError
        
        // Organiser les permissions par rôle
        const permissionsByRole = {
          admin: [],
          collaborateur: [],
          lecture_seule: []
        };
        
        permissions?.forEach(permission => {
          if (permissionsByRole[permission.role]) {
            if (permission.can_access) {
              permissionsByRole[permission.role].push(permission.module_id);
            }
          }
        });
        
        result = permissionsByRole;
        break;
        
      case 'UPDATE_PERMISSION':
        const { role, moduleId, canAccess } = data;
        
        // Vérifier si la permission existe déjà
        const { data: existingPermission, error: fetchError } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role', role)
          .eq('module_id', moduleId)
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        
        let updateResult;
        
        if (existingPermission) {
          // Mettre à jour la permission existante
          const { error: updateError } = await supabase
            .from('role_permissions')
            .update({ can_access: canAccess })
            .eq('id', existingPermission.id);
          
          if (updateError) throw updateError;
          updateResult = { updated: true, id: existingPermission.id };
        } else {
          // Créer une nouvelle permission
          const { data: insertedPermission, error: insertError } = await supabase
            .from('role_permissions')
            .insert({
              role,
              module_id: moduleId,
              can_access: canAccess
            })
            .select('id')
            .single();
          
          if (insertError) throw insertError;
          updateResult = { inserted: true, id: insertedPermission.id };
        }
        
        result = {
          success: true,
          ...updateResult
        };
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`)
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
