import Head from 'next/head';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import styles from './over.module.scss';
import siteText from 'locale';

import MDToHTMLString from 'utils/MDToHTMLString';

import openGraphImage from 'assets/sharing/og-cijferverantwoording.png?url';
import twitterImage from 'assets/sharing/twitter-cijferverantwoording.png?url';

interface ICijfer {
  cijfer: string;
  verantwoording: string;
}

interface StaticProps {
  props: {
    text: typeof siteText;
  };
}

// We use lokalise.com as our dictionary/text source and to support internationalisation.
// Lokakise will output JSON files which can be found in `src/locale`.
// However, all content lives inside plain strings. To support structured content and newlines,
// we (optionally) write markdown in Lokakise and parse it to HTML.
//
// Ideally this entire page would have been build from markdown, but that’s not possible
// with our internationalisation setup.
export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  const serializedContent = text.verantwoording.cijfers.map(function (
    item: ICijfer
  ) {
    return { ...item, verantwoording: MDToHTMLString(item.verantwoording) };
  });

  text.verantwoording.cijfers = serializedContent;

  return { props: { text } };
}

const Verantwoording: FunctionComponentWithLayout<{ text: any }> = (props) => {
  const { text } = props;

  return (
    <>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            <h2>{text.verantwoording.title}</h2>
            <p>{text.verantwoording.paragraaf}</p>
            <dl className={styles.faqList}>
              {text.verantwoording.cijfers.map((item: ICijfer) => (
                <>
                  <dt>{item.cijfer}</dt>
                  <dd
                    dangerouslySetInnerHTML={{
                      __html: item.verantwoording,
                    }}
                  ></dd>
                </>
              ))}
            </dl>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Verantwoording.getLayout = Layout.getLayout({
  ...siteText.verantwoording_metadata,
  openGraphImage,
  twitterImage,
});

export default Verantwoording;
