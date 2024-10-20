import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

interface PlayerData {
    login: string;
    scoreTotal: number;
    date : number;
   }

   const EndGameScore: React.FC<{ dataPlayer: PlayerData }> = ({ dataPlayer }) => {

    const router = useRouter();

    const btnRejouer = () => {
        router.push('/hub'); 
    };
    
    return (
        
       
        <div className="flex items-center justify-center h-[100vh]">
        
             <div className="flex items-center justify-center h-[80vh] flex-col mb-60">
            <h1 className='text-amber-400 text-9xl'>Ton score final !</h1>
            <h2 className='text-black text-6xl mt-4'>{dataPlayer.scoreTotal} pts</h2>

            <Button className='bg-amber-500 mt-10' onClick={btnRejouer}>Rejouer</Button>
           
        </div>
            
     
               
        </div>   
       
    );
};

export default EndGameScore;
