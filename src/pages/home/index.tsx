import { FormEvent, useEffect, useState } from 'react';

import styles from './home.module.css';

import { BiSearch } from 'react-icons/bi';

import { Link, useNavigate } from 'react-router-dom';

//https://sujeitoprogramador.com/api-cripto/?key=d94184d0d0d8bddd OU 'https://sujeitoprogramador.com/api-cripto/?key=67f9141787211428&pref=BRL'


interface CoinsProps{
    name: string;
    delta_24h: string;
    price: string;
    symbol: string;
    volume_24h: string;
    market_cap: string;
    formatedPrice: string;
    formatedMarket: string;
    numberDelta: number;
}

interface DataProps{
    coins: CoinsProps[];
}

export function Home(){
    const [coins, setCoins] = useState<CoinsProps[]>([]);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    useEffect(()=> {
        async function getData() {
            fetch('https://sujeitoprogramador.com/api-cripto/?key=d94184d0d0d8bddd&pref=BRL')
            .then(response => response.json())
            .then((data: DataProps) => {
                let coinsData = data.coins.slice(0, 30);

                let price = Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })

                const formatResult = coinsData.map((item) => {
                    const formated = {
                        ...item,
                        formatedPrice: price.format(Number(item.price)),
                        formatedMarket: price.format(Number(item.market_cap)),
                        numberDelta: parseFloat(item.delta_24h.replace(",", "."))
                    }

                return formated;        
                })

                setCoins(formatResult);
            })
        }

        getData();

    }, [])

    function handleSeach(e: FormEvent){
        e.preventDefault();//para não atualizar a página
        if(inputValue=== "") 
            return
        navigate(`/detail/${inputValue}`);
    }

    return(
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSeach}  >
                <input 
                placeholder="Digite o simbolo da moeda: BTC..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}  //para pegar o que digitou no input
                />
                <button type="submit">
                    <BiSearch size={30} color='FFF' />

                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moedas</th>
                        <th scope="col">Valor mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                    </tr>
                </thead>

                <tbody id="tbody">
                    {coins.map( coin => (
                        <tr key={coin.name} className={styles.tr}>
                        <td className={styles.tdLabel} data-label="Moeda">
                            <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                                <span>{coin.name}</span> | {coin.symbol}
                            </Link>
                        </td>
                        <td className={styles.tdLabel} data-label="Mercado" >
                            {coin.formatedMarket}
                        </td>
                        <td className={styles.tdLabel} data-label="Preço">
                            {coin.formatedPrice}
                        </td>
                        <td className={coin.numberDelta >= 0 ? styles.tdProfit : styles.tdLoss }  data-label="Volume">
                            <span>{coin.delta_24h}</span>
                        </td>
                    </tr>
                    ) )}
                    
                </tbody>
            </table>
        </main>
    )
}
