import { useCallback, useState } from 'react';
import Head from 'next/head';

import { COOKIE_NAME } from '../constants/app';
import styles from '../styles/Home.module.css'

const Home = ({ id }) => {
  const [cookiaData, setCookieData] = useState(id);
  const [newValue, setNewValue] = useState('');
  const [pokemon, setPokemon] = useState(null);

  const fetchPoke = async (pokeId) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
      const { name, sprites } = await res.json();
  
      setPokemon({
        image: sprites?.other?.['official-artwork'].front_default,
        name,
      });
    } catch {
      setPokemon(null);
    }
  }

  const handlefetchPokeClick = async () => {
    const pokeId = Math.floor(Math.random() * 150) + 1;

    fetchPoke(pokeId);
  }

  const handleSubmit = async e => {
    e.preventDefault();

    const setCookieRes = await fetch('/api/set-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newValue)
    });

    if (setCookieRes.status === 200) {
      setCookieData(newValue);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next cookie tester</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Next cookie tester
        </h1>

        <div className={styles.description}>
          <h2>Current cookie data</h2>

          <p><code className={styles.code}>{cookiaData ? cookiaData : `⚠️ No value has been set ⚠️`}</code></p>
        </div>

        <div className={styles.description}>
          <h2>Set a new value</h2>

          <p>This sets a new cookie with the following options:</p>

          <p>
            <code className={styles['code-block']}>
              HttpOnly;<br />
              Max-Age=86400;<br />
              Path=/;<br />
              SameSite=Lax;<br />
              Secure;<br />
            </code>
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles['form-row']}>
              <input className={styles.input} id="newValue" name="newValue" required type="text" onChange={e => setNewValue(e.target.value)} />
            </div>
            
            <button className={styles.button} type="submit">Set</button>
          </form>
        </div>

        {cookiaData && (
          <>
            <div className={styles.description}>
              <h2>Third party API</h2>

              <p>To test this, the button below will fetch a random pokémon from the PokéAPI. The data is restricted to the first 150.</p>

              <p>Opening up DevTools and inspecting the request should show that the cookie value set above is not passed with the request. However setting a new value will pass the current cookie value as that API is within the same domain.</p>

              <button className={styles.button} type="button" onClick={handlefetchPokeClick}>Fetch me a Pokémon!</button>
            </div>
            
            {pokemon && (
              <div className={styles.description}>
                <h2>{pokemon.name}</h2>

                <img alt={pokemon.name} className={styles.pokemon} src={pokemon.image} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const id = context.req.cookies[COOKIE_NAME] || null;

  return {
    props: {
      id
    }
  }
}

export default Home;
