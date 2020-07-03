<template>
  <div>
<!--
  note on tailwind classes:
    - removed hidden: because no phone version in this mockup, so we keep showing main nav
    - removed fixed: to allow proper vertical flow in to of overall layout
    - note that adding the click handler lets the full button act like router-link,
      before any more complex methods, esp. as may be proposed for Vue 3
   -->
    <div class="navbar nav-bg bg-opacity-100 w-screen h-16 top-0 text-white md:block z-20">
      <div class="container mx-auto max-w-5xl flex items-center h-full ">
       <nav class="flex">
         <div
            @click="$router.push(item.name)"
            :key="item.label"
            v-for="item in items"
            active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
            class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
          >
           <div v-if="item.type === 'remote'">
             <a :href="item.name" target="_blank">{{ item.label }}</a>
           </div>
           <div v-else>
             <router-link :to="item.name">{{ item.label }}</router-link>
           </div>
          </div>
       </nav>
      </div>
    </div>
  </div>
</template>

<static-query>
  query{
    metadata{
      siteName
    },
    allPage{
      path
      context
    }
  }
</static-query>

<script>

export default {
  name: "Nav",
  // components: { BookmarksMenu },
  data: function() {
    return {
      items: [
        { name: "/",
          label: "Home",
          type: 'local'
        },
        {
          name: "/data-operations",
          label: "Data Operations",
          type: 'local'
        },
        {
          name: "/file-operations",
          label: "File Operations",
          type: 'local'
        },
        {
          name: "https://www.google.com/search?q=oceanic&source=lnms&tbm=isch",
          label: "Panel",
          type: 'remote'
        },
        {
          name: "/documentation",
          label: "Documentation",
          type: 'local'
        },
        {
          name: "/about",
          label: "About",
          type: 'local'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 64rem;
}
.test {
  color: red !important;
}

.router-link-exact-active { /* must be exact, or you light home always */
  color: lightseagreen;
}

.nav-bg {
  background-color: teal
}

.translate {
  animation: animate alternate 0.2s ease-in-out;
}

@keyframes animate {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
