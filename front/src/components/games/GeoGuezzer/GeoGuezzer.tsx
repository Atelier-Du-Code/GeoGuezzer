import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';


import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useGetDataPictureGeo } from '@/hooks/dataPictureGeo';
import { jwtDecode } from 'jwt-decode';
import EndGameScore from './EndGameScore';


const Map = dynamic(() => import('./Map'), { ssr: false });

const GeoGuezzer = () => {
    // Gestion des modales
    const [showModalRules, setShowModalRules] = useState<boolean>(true);
    const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
    const [showReponse, setShowReponse] = useState<boolean>(false);
    const [msgButton, setMsgButton] = useState<string>('Valider position');
    const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
    const [roundFinishTime, setRoundFinishTime] = useState<number>(-1);

    // Logique de jeu
    const [latitudeImage, setLatitudeImage] = useState<number | null>(null);
    const [longitudeImage, setLongitudeImage] = useState<number | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

    // Gestion des tours
    const [nbTours, setNbTours] = useState<number>(1); // Nombre de tours en cours de jeu
    const nbTotalTours = 3; // Nombre total de tours

    // Récupération des images en début de partie
    const { data, isError, isPending } = useGetDataPictureGeo(nbTotalTours);
    const [images, setImages] = useState<any[]>([]);

    // Gestion fin de jeu
    const [distance, setDistance] = useState<number>(100000);
    const [score, setScore] = useState<number>(0);
    const [showEndGame, setShowEndGame] = useState<boolean>(false);

    interface PlayerData {
        login: string;
        scoreTotal: number;
        date : number;
       }

    const [playerData, setPlayerData] = useState<PlayerData>({
        login: 'anonymous',
        scoreTotal: 0,
        date: 0,
    });

    useEffect(() => {
        setTimeout(() => setIsButtonDisabled(false), 6000);
        
       
    }, []);

    // Récupération des données
    useEffect(() => {
        if (isPending) {
            setIsButtonDisabled(true);
            return;
        }

        if (isError) {
            console.error('Erreur lors de la récupération des données');
            setIsButtonDisabled(true);
            return;
        }

        if (data) {
            // Ajouter les nouvelles données au tableau d'images
            setImages((prevImages) => [...prevImages, ...data]);

            // Réactiver le bouton après un délai
            setTimeout(() => setIsButtonDisabled(false), 6000);
        }
    }, [data, isPending, isError]);

    // Mise à jour de la latitude et la longitude de l'image
    useEffect(() => {
        if (images.length > 0 && images[nbTours - 1]) {
            const [lon, lat] = images[nbTours - 1].geometry.coordinates;
            setLatitudeImage(lat);
            setLongitudeImage(lon);
        } else {
            console.warn('Aucune image disponible pour ce tour.');
        }
    }, [nbTours, images]);

    // Calcul du nombre de kilomètres entre le clic sur la map et l'image
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const toRadians = (degree: number): number => degree * (Math.PI / 180);
        const R = 6371; // Rayon de la Terre en km

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c);
    };

    // Actions au clic sur la map
    const handleMapClick = (latlng: { lat: number; lng: number }) => {
        if (latitudeImage !== null && longitudeImage !== null) {
            const calculatedDistance = haversineDistance(latitudeImage, longitudeImage, latlng.lat, latlng.lng);
            setDistance(calculatedDistance);
        } else {
            console.warn("Coordonnées de l'image non disponibles.");
        }
    };

    // Validation du clic pour 1 joueur
    const ValideClick_1Joueur = () => {
        if (!showReponse) {
            const findTime = Date.now() - roundStartTime;
            const timeBonus = 1000000 / findTime;
            const newScore = distance < 300 ? (100 * 1000) / distance + timeBonus : 0;
    
            setRoundFinishTime(Math.round(findTime / 1000));
            setScore((prevScore) => Math.round(prevScore + newScore)); // Arrondir le score ici
    
            setPlayerData((prevPlayerData) => ({
                ...prevPlayerData,
                scoreTotal: Math.round(prevPlayerData.scoreTotal + newScore), // Arrondir le score total ici
            }));
    
            setShowReponse(true);
            setMsgButton('Voir score');
        } else {
            setShowReponse(false);
            setShowModalFeedback(true);
            setMsgButton('Valider position');
        }
    };
    

    const handleFeedbackClose = () => {
        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 6000); // Réactiver après un délai
        handleRoundEnd();
        setRoundStartTime(Date.now());
    };

    const handleRoundEnd = () => {
        if (nbTours < nbTotalTours) {
            setNbTours((prevNbTours) => prevNbTours + 1);
            setShowModalFeedback(false);
        } else {
            setShowModalFeedback(false);
            setTimeout(() => setShowEndGame(true), 1000); // Ajout d'un délai pour la fin de jeu
        }
    };

    // Rendu de la fin de jeu
    if (showEndGame) {
        return <EndGameScore dataPlayer={playerData} />;
    }
    return (
        <div>
            {/* Modale des règles */}
            {showModalRules && (
                <Dialog open={showModalRules} onOpenChange={() => {}}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center leading-[1.5rem]">Règles du GeoGuezzer</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-center text-[16px]">
                            Devinez le lieu exact où vous êtes en vous basant uniquement sur l'environnement de l'image du haut. Plus votre
                            réponse est précise et rapide, plus vous marquez de points ! <br />
                            Attention, une réponse trop éloignée ne rapporte pas de points !
                        </DialogDescription>
                        <DialogFooter>
                            <div className="flex justify-center w-full">
                                <DialogClose asChild>
                                    <Button onClick={() => setShowModalRules(false)}>Jouer</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modale de feedback */}
            {showModalFeedback && (
                <Dialog open={showModalFeedback} onOpenChange={() => {}}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center">Fin de tour</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-center">
                            {distance < 300 ? 'Gagné' : 'Trop loin, pas de points !'} <br />
                            {'Ton score : '}
                            {score} <br />
                            {'Distance : '}
                            {distance}
                            {' km'}
                            <br />
                            {'Trouvé en : '}
                            {roundFinishTime + ' secondes'}
                            <br />
                        </DialogDescription>
                        <DialogFooter>
                            <div className="flex justify-center w-full">
                                <DialogClose asChild>
                                    <Button onClick={handleFeedbackClose}>Suivant</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Affichage du jeu */}
            {!showModalRules && !showModalFeedback && images.length > 0 && (
                <div className="h-[19vh] flex flex-col m-10">
                    <div className="flex flex-grow">
                        <div className="flex border-6 items-center justify-center flex-1 h-[80vh] m-2">
                            <iframe
                                src={`https://www.mapillary.com/embed?image_key=${images[nbTours - 1]?.id}&style=photo`}
                                height="100%"
                                width="100%"
                                title="Mapillary Street View"
                                
                            />

                            <div className="flex items-center justify-center ml-5 mr-5">
                                {latitudeImage !== null && longitudeImage !== null ? (
                                    <Map
                                        onMarkerPositionChange={handleMapClick}
                                        showReponse={showReponse}
                                        imageLocalisation={{ lat: latitudeImage, lng: longitudeImage }}
                                    />
                                ) : (
                                    <p>Loading map...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center m-4">
                        <Button onClick={ValideClick_1Joueur} className="bg-orange-300" disabled={isButtonDisabled}>
                            {msgButton}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeoGuezzer;
