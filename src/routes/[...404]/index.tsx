import { component$, $, useOnDocument } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { LogoBirdflop } from '@luminescent/ui-qwik';
import { HomeOutline } from 'qwik-ionicons';
import Background from '~/components/images/background.png?jsx';
import { unloadGoogleAds } from '~/components/util/GoogleAds';

export const onGet: RequestHandler = async ({ json, request }) => {
  // check if contenttype is json
  if (request.headers.get('content-type') !== 'application/json') return;

  throw json(404, {
    error: 'Endpoint not found.',
  });
};

export default component$(() => {
  // Keeping below unloading in case we mess up navbar in future
  useOnDocument(
    'load',
    $(() => {
      unloadGoogleAds();
    }),
  );

  return (
    <section class="flex mx-auto max-w-7xl px-6 items-center justify-center min-h-svh" >
      <Background class="fixed inset-0 scale-110 overflow-hidden -z-10 h-lvh w-lvw object-cover object-center opacity-45 grayscale blur-lg" id="bg" alt="background" />
      <div class="text-red-400 text-4xl">
        <LogoBirdflop confused width={100} fillGradient={['#54daf4', '#545eb6']} />
        <h1 class="font-bold mb-4 mt-6">404: Page not found</h1>
        <p class="font-italic text-gray-400 text-xl">
          Whoops! You've hit a dead-end.
        </p>
        <div class="flex mt-4">
          <Link href="/" class="lum-btn lum-pad-lg text-lg lum-bg-blue-700/80 hover:lum-bg-blue-600 gap-4">
            <HomeOutline width={24} /> Go back home
          </Link>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: '404: Page not found',
  meta: [
    {
      name: 'description',
      content: 'Whoops! You\'ve hit a dead-end.',
    },
    {
      name: 'og:description',
      content: 'Whoops! You\'ve hit a dead-end.',
    },
    {
      name: 'og:image',
      content: '/branding/icon.png',
    },
  ],
};