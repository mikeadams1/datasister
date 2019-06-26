import React from 'react';
import '@inrupt/solid-style-guide';
import $rdf, { NamedNode } from 'rdflib';
import './App.css';
import { ResourceLoader } from './components/ResourceLoader';
import { DataBrowserContextData, DataBrowserContext } from './context';
import { usePodOrigin } from './hooks/usePodOrigin';
import { Loading } from './components/Loading';
import { Connect } from './components/Connect';
import { useResourceLoader } from './hooks/useResourceLoader';
import { useResourceRouter, loadResource } from './hooks/useResourceRouter';
import { Header } from './components/styleguide/Header';
import { Dashboard } from './Dashboard';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);

const App: React.FC = () => {
  const podOrigin = usePodOrigin(store, fetcher);
  const resourcePath = useResourceRouter(podOrigin);
  const resource = useResourceLoader(resourcePath, fetcher);

  if (typeof podOrigin === 'undefined') {
    return (<Loading/>);
  }
  if (podOrigin === null) {
    return (
      <>
        <section className="banner banner-wrap--error">
          <div className="banner-wrap__content">Could not find a Pod to browse.</div>
        </section>
        <Connect/>
      </>
    );
  }

  const dataBrowserContext: DataBrowserContextData = { store, fetcher, podOrigin, loadResource };

  return (
    <DataBrowserContext.Provider value={dataBrowserContext}>
      <div className="App">
        <Header/>
        <div className="header-spacer"/>
        {

        }
        <MainContent podOrigin={podOrigin} resourcePath={resourcePath} resource={resource}/>
      </div>
    </DataBrowserContext.Provider>
  );
}

const MainContent: React.FC<{
  podOrigin: string,
  resourcePath: string | undefined,
  resource: NamedNode | undefined
}> = (props) => {
  if (props.resourcePath === props.podOrigin || props.resourcePath === props.podOrigin + '/') {
    return <Dashboard/>
  }
  return <ResourceLoader resource={props.resource}/>;
}

export default App;
