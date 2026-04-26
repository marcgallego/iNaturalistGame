import Link from 'next/link'
import '@/app/globals.css'

export default function Home() {
  return (
    <div className="grid place-items-center h-screen text-center" style={{ height: '90vh' }}>
      <div>
        <h1 className="text-4xl font-bold text-blue-600">Benvingut, estàs preparat?</h1>
        <h2 className="text-2xl mt-4 text-gray-700">Identifica la fauna i la flora del teu entorn!</h2>
        <br />
        <button
          className="px-4 py-2 my-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Link href={`/explore/1`}> Explora la taxonomia dels animals de iNaturalist</Link>
        </button>
        <br />
        <button
          className="px-4 py-2 my-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Link href={`/new_test`}> Posa a prova els teus coneixements!</Link>
        </button>
      </div >
      <div className="fixed bottom-2 flex items-center text-s text-gray-500">
        <span className="mr-2">Desenvolupat per Fernando Gastón</span>
        <span className="mr-2">
          <a href="https://www.linkedin.com/in/fernando-gaston/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.342-1.248-.822 0-1.358.54-1.358 1.248 0 .694.52 1.248 1.327 1.248h.015zm4.908 8.212h2.4V9.359c0-.215.016-.43.08-.584.175-.43.574-.877 1.244-.877.877 0 1.228.662 1.228 1.634v3.862h2.4V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.015a5.6 5.6 0 0 1 .015-.025V6.169h-2.4c.03.7 0 7.225 0 7.225z" />
            </svg>
          </a>
        </span>
        <a href="https://github.com/fernando-gaston" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </div >
  );
}