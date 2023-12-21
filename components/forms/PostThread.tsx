"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { useUploadThing } from "@/lib/uploadthing";
import { createThread, fetchClass } from "@/lib/actions/thread.actions";

interface Props {
  userId: string;
  userCom: string;
  authorId: string;
}

type Matiere = {
  _id: string;
  codematiere: string;
  title: string;
};

function PostThread({ userId, userCom, authorId}: Props) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onNiveauChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const niveau = event.target.value;
    const matieresPourNiveau = await fetchClass(niveau);
    setMatieres(matieresPourNiveau);
  };

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      document:"",
      thread: "",
      accountId: userId,
      niveau: "",
      matiere: "",
      title:"",
    },
  });

  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("pdf")) {
        setError("document", { type: "manual", message: "Seuls les fichiers PDF sont autorisés." });
        return; // Interrompre si le fichier n'est pas un PDF
      }

      setFiles(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const fileDataUrl = event.target?.result?.toString() || "";
        fieldChange(fileDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const { setError, clearErrors, handleSubmit, control, formState: { errors } } = form;

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    let hasError = false;
    setIsLoading(true);
    clearErrors(); // Effacer les erreurs précédentes

    if (!files.length) {
      setError("document", { type: "manual", message: "Un document est requis." });
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

    if (!values.matiere) {
      setError("matiere", { type: "manual", message: "Une matière est requise." });
      hasError = true;
    }

    if (hasError) return setIsLoading(false); // S'arrête ici si une erreur est trouvée

    const imgRes = await startUpload(files);
    try {
      if (imgRes && imgRes[0].fileUrl) {
        values.document = imgRes[0].fileUrl;
      }
    
    
      await createThread({
        text: values.thread,
        author: userId,
        authorId: authorId,
        communityId: userCom,
        document: values.document,
        title: values.title,
        niveau: values.niveau,
        matiere: values.matiere
    });
    router.push("/");
    } catch (error) {
      
      // Gestion des erreurs
      // Par exemple, afficher l'erreur dans la console ou définir un état d'erreur pour l'afficher dans l'UI
      console.error("Erreur lors de la création : ", error);
    }
    finally {
      setIsLoading(false); // Arrête le chargement une fois terminé
    }
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='document'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='application/pdf'  
                  placeholder='Ajouter un document'
                  className='account-form_image-input'
                  onChange={(e) => handleFile(e, field.onChange)}
                />
              </FormControl>
              {errors.document && (
                <p className="text-red-500 text-xs">{errors.document.message}</p>
              )}
            </FormItem>
          )}
        />

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
                  onChange={(e) => {
                    field.onChange(e);
                    onNiveauChange(e);
                  }}
                  className="font-sans mb-4 block px-4 py-2 text-base border rounded-md shadow-sm bg-dark-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-primary-500 transition duration-200"
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
          name='matiere'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Matière
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <select {...field} className="font-sans mb-4 block px-4 py-2 text-base border rounded-md shadow-sm bg-dark-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-primary-500 transition duration-200"
                >

                  <option value="" disabled hidden>Sélectionnez la matière</option>
                  {matieres.map(matiere => (
                  <option key={matiere.codematiere} value={`${matiere.codematiere}-${matiere.title}`}>{matiere.codematiere}-{matiere.title}</option>
                ))}
                </select>       
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
              <FormControl className='h-20 no-focus border border-dark-4 bg-dark-3 text-light-1 hover:border-primary-500 transition duration-200'>
                <Textarea rows={4} {...field} maxLength={600} />
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
            "Uploader le document"
          )}
        </Button>
      </form>
    </Form>
  );
}
export default PostThread;
