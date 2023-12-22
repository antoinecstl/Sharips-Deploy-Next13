"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    Lastname: string;
    firstname: string;
    id: string;
    objectId: string;
  };
}

const AccountProfile = ({ user }: Props) => {
  const validCommunities = ["communitie1", "communitie2", "communitie3"];
  const [communitie, setCommunitie] = useState("");
  const [error, setError] = useState(""); // État pour l'erreur
  const router = useRouter();
  const pathname = usePathname();

  const onSubmit = async () => {
    if (!validCommunities.includes(communitie)) {
      setError("Veuillez sélectionner votre école.");
      return;
    }

    try {
      await updateUser({
        lastname: user.Lastname,
        firstname: user.firstname,
        communitie: communitie,
        path: pathname,
        userId: user.id,
      });

      // Si tout se passe bien, redirigez ou effectuez d'autres actions
      router.push("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Une erreur est survenue lors de la mise à jour.");
    }
  };

  const isButtonDisabled = communitie === "" || !validCommunities.includes(communitie);

  return (
    <div className="">
      <select 
        value={communitie} 
        onChange={(e) => { setCommunitie(e.target.value); setError(""); }} 
        className="font-sans mb-4 px-4 py-2 text-small-medium sm:text-base-medium border rounded-md shadow-sm bg-dark-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 "
      >
        <option value="" disabled hidden>Sélectionnez votre école</option>
        <option value="communitie1">IPSA (Institut Physique des Sciences Appliquées)</option>
        {/* Ajoutez plus d'options si nécessaire */}
      </select>
      <Button 
        onClick={onSubmit} 
        type='submit' 
        className={`w-1/2 ml-auto rounded-md text-small-medium sm:text-base-medium shadow ${isButtonDisabled ? 'text-black bg-primary-200' : 'bg-primary-500 hover:opacitiy-90'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
        disabled={isButtonDisabled}
      >
        Commencer
      </Button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default AccountProfile;
