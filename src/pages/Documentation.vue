<template>
  <Layout>
    <div class="container max-w-4xl">
      <div class="content">
        <h1 class="font-bold text-3xl md:text-4xl mb-3">Documentation</h1>
        <p class="text-lg">
          Documentation will emerge here, and we're basing on Jose's component for it,
          presently being developed on CombatCovid. We'll keep up with this as it fills out.
        </p>
        <p class="text-lg">
          What we'll talk about are design and implementation points for using
          and succeeding on this Hardocs App Framework.
        </p>
        <h1 class="font-bold text-3xl md:text-4xl mb-3">What the Hardocs App Framework provides</h1>
        <p class="text-lg">
          The intention is that features developed on this framework will continue to
          function just as originally expected, across each widening of capability planned
          in the foundation being prepared: the Hardocs architecture.
        </p>
      </div>
    </div>
  </Layout>
</template>

<script>

import Layout from '@/layouts/Default'

export default {
  metaInfo: {
    title: "Documentation"
  },
  components: {
    Layout
  }
}
</script>

<style scoped lang="scss">
.content {
  max-width: 640px;
  margin: 20px auto;
  padding: 20px;
  text-align: left;
}
.container {
  max-width: 64rem;
  & > * {
  line-height: 2;

  p {
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5em;
    margin-top: 2rem;
  }
  //h2::before {
  //  content: "# ";
  //  font-size: 1.5em;
  //  margin-left: -1.1em;
  //}
}
}
</style>
