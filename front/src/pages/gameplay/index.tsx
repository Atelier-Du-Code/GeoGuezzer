import GeoGuezzer from '@/components/games/GeoGuezzer/GeoGuezzer';
import { Card } from '@/components/ui/card';

const Gameplay = () => {

    return (
        <>
            <div className="flex flex-col-reverse lg:flex-row-reverse p-4 lg:p-6 gap-2 lg:gap-4 h-[100vh]">
               
                <div className="relative w-full flex flex-col items-center gap-2 h-[100%]">
                    <Card className="h-[100%] rounded-[0.9rem] priority-rounded w-full lg:min-w-[98%] bg-purple-700 ">               
                        
                        <GeoGuezzer/>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Gameplay;
