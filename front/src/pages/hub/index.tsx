import GeoGuezzer from '@/components/games/GeoGuezzer/GeoGuezzer';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/router';

import { useState } from 'react';


   const Hub = () => {
    const router = useRouter();

    const btnJouer = () => {
       router.push('/gameplay'); 
    }

    return (

       
         <div className="flex items-center justify-center h-[100vh]">
            <Card className="h-[80vh] w-[70vw]  rounded-[0.9rem]  bg-purple-700">   
            <div className="flex items-center flex-col"> 

                <img className='mb-[-22vh] mt-10' src="planete.png" alt="logo de geoguezzer" />

                <h1 className='text-amber-400 mt-[10vh] mb-[-50px] text-9xl'>Geoguezzer</h1>
               
                <Button onClick={btnJouer} className='bg-amber-500 mt-[8vh]'>Jouer</Button>

                </div> 
            </Card>  
               
        </div>            
                        
       
   
    );
};

export default Hub;
