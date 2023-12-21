"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MatiereValidation } from "@/lib/validations/thread";
import { createClass} from "@/lib/actions/thread.actions";

interface Props {
  userId: string;
  userCom: string;
}



function Newclass({ userId, userCom}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof MatiereValidation>>({
    resolver: zodResolver(MatiereValidation),
    defaultValues: {
        thread: "",
        accountId: userId,
        niveau: "",
        codematiere: "",
        title: "",
    },
  });

  const { setError, clearErrors, handleSubmit, control, formState: { errors } } = form;

  const onSubmit = async (values: z.infer<typeof MatiereValidation>) => {
    let hasError = false;
    setIsLoading(true);
    clearErrors(); // Effacer les erreurs précédentes

    if (!values.codematiere) {
      setError("codematiere", { type: "manual", message: "Le code de la matière est requis." });
      hasError = true;
    }

    if (!values.title) {
      setError("title", { type: "title", message: "Un titre est requis." });
      hasError = true;
    }

    if (!values.niveau) {
      setError("niveau", { type: "manual", message: "Un niveau d'étude est requis." });
      hasError = true;
    }

    if (hasError) return setIsLoading(false); // S'arrête ici si une erreur est trouvée
    
    try {
      await createClass({
        text: values.thread,
        author: userId,
        communityId: userCom,
        title: values.title,
        niveau: values.niveau,
        codematiere: values.codematiere,
      });
      router.push("/");
    } catch (error) {
        console.error("Erreur lors de la création : ", error);
    }
    finally {
        setIsLoading(false); // Arrête le chargement une fois terminé
      }
  }
  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='niveau'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Niveau
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <select 
                  {...field}
                  className="font-sans mb-4 block px-4 py-2 text-base border rounded-md shadow-sm bg-dark-2 hover:border-primary-500 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 "
                >
                  <option value="" disabled hidden>Sélectionnez le niveau d'étude</option>
                  <option value="1">Aéro 1</option>
                  <option value="2">Aéro 2</option>
                  <option value="3">Aéro 3</option>
                  <option value="4">Aéro 4</option>
                  <option value="5">Aéro 5</option>
                </select>       
               </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='codematiere'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Code Matière
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1 '>
                <Textarea className="h-10 w-1/2 hover:border-primary-500 transition duration-200" {...field} placeholder="Exemple : In322" maxLength={10} />
               </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Titre
              </FormLabel>
              <FormControl className='h-10 no-focus border border-dark-4 bg-dark-3 text-light-1 hover:border-primary-500 transition duration-200'>
                <Textarea {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Description
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1 hover:border-primary-500 transition duration-200'>
                <Textarea rows={2} {...field} maxLength={600} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500 flex items-center justify-center' disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              <span className="ml-3">Chargement...</span>
            </>
          ) : (
            "Ajouter"
          )}
        </Button>
      </form>
    </Form>
  );
}
export default Newclass;
