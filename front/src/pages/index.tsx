import { Inter } from 'next/font/google';
import Hub from '../pages/hub/index';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {   

    return (
        <main className={`${inter.className}`}>
            <Hub />
        </main>
    );
}