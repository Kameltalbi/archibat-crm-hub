
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { HistoryItemType } from "./HistoryTimeline";

// Définir le schéma de validation pour le formulaire
const formSchema = z.object({
  type: z.enum(["modification", "document", "call", "meeting", "note"], {
    required_error: "Veuillez sélectionner un type d'historique",
  }),
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHistoryItemFormProps {
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
}

export const AddHistoryItemForm = ({
  onSubmit,
  isSubmitting,
}: AddHistoryItemFormProps) => {
  // Initialiser le formulaire avec useForm
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "note",
      title: "",
      description: "",
    },
  });

  // Fonction de soumission du formulaire
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'action</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="modification">Modification</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="call">Appel</SelectItem>
                  <SelectItem value="meeting">Réunion</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de l'action" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de l'action"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "En cours..." : "Ajouter"}
        </Button>
      </form>
    </Form>
  );
};
