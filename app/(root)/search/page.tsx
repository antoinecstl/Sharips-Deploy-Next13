"use client"
import { useState } from "react";
import Fuse from "fuse.js";
import Searchbar from "@/components/shared/Searchbar";
import { fetchClass } from "@/lib/actions/thread.actions";
import MatiereCard from "@/components/cards/MatiereCard";

function Page() {
  // Types et états
  type Matiere = {
    id: string;
    codematiere: string;
    title: string;
  };

  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Chaîne de recherche

  // Options de configuration pour Fuse.js
  const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ["title", "codematiere"],
  };

  // Créer une instance de Fuse avec la liste des matières et les options
  const fuse = new Fuse(matieres, fuseOptions);

  // Fonction pour gérer le changement de niveau
  const onNiveauChange = async (niveau: string) => {
    const matieresPourNiveau = await fetchClass(niveau);
    setMatieres(matieresPourNiveau);
    setSelectedNiveau(niveau);
    setSearchTerm(''); // Réinitialiser le terme de recherche lorsqu'un nouveau niveau est sélectionné
  };

  // Niveaux disponibles
  const niveaux = ['1', '2', '3', '4', '5'];

  // Effectuer la recherche floue lorsque searchTerm n'est pas vide
  const filteredMatieres = searchTerm
    ? fuse.search(searchTerm).map(result => result.item).slice(0,5)
    : [];

  return (
    <section>
       {selectedNiveau && (
      <h1 className='head-text mb-8'>Explorateur</h1>
       )}
      {!selectedNiveau && (
        <main className="">
        <div className="sm:mt-32 text-center text-heading3.5-bold sm:text-heading3-bold">
          <h3 className="text-white underline decoration-primary-500 hidden sm:block">Commencez par sélectionner un niveau</h3>
          <h3 className="text-white my-4 underline decoration-primary-500 sm:hidden">Sélectionnez un niveau</h3>
        </div>
        <div className="flex grid sm:grid-cols-5 sm:gap-6 mb-4 mx-10 sm:mx-auto ">
            {niveaux.map((niveau) => (
              <button
                key={niveau}
                className="mt-6 sm:mt-10 py-8 text-body-semibold rounded-xl shadow-sm bg-slate-900 transition duration-200 hover:bg-primary-500 text-white"
                onClick={() => onNiveauChange(niveau)}
              >
                Aéro {niveau}
              </button>
            ))}
          </div>
          </main>
        )}

     {selectedNiveau && ( 
      <div className="flex grid grid-cols-5 gap-4 sm:gap-6 mb-4">
        {niveaux.map((niveau) => (
          <button
            key={niveau}
            className={`mb-4 mx-max py-4 text-body-normal rounded-xl shadow-sm transition duration-200 ${
              selectedNiveau === niveau
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-900 border border-slate-900 hover:border-primary-500 text-white'
            }`}
            onClick={() => onNiveauChange(niveau)}
          >
            Aéro {niveau}
          </button>
        ))}
      </div>
      )}

      {selectedNiveau && (
        <><Searchbar
          routeType='search'
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm} />
          <p className="text-primary-500 ml-2">Résultat</p></>
      )}

      {filteredMatieres.length > 0 ? (
        filteredMatieres.map(matiere => (
          <div className="mt-2">
          <MatiereCard id={matiere.id} codematiere={matiere.codematiere} title={matiere.title}/>
          </div>
        ))
      ) : searchTerm && (
        <><p className="text-white ml-2 mb-4">Aucune matière trouvée pour la recherche : "{searchTerm}"</p>
        <p className="text-primary-500 ml-2">Autres matières</p></>

      )}
      
      {filteredMatieres.length == 0 ? (
        matieres.map(matiere => (
          <div className="mt-2">
          <MatiereCard id={matiere.id} codematiere={matiere.codematiere} title={matiere.title}/>
          </div>
        ))
      ) : null }

      
    </section>
  );
}

export default Page;
