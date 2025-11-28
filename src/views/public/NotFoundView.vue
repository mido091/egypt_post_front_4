<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
  >
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600 dark:text-blue-500">404</h1>
      <h2
        class="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl"
      >
        Page not found
      </h2>
      <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </router-link>
      </div>
    </div>
  </div>
</template>
