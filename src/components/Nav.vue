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
            @click="handleMenu(item)"
            :key="item.label"
            v-for="item in items"
            active-class="p-4 mx-2 text-primary-25 hover:text-blue-100"
            class="p-2 hover:bg-primary-25 rounded-md mx-2 text-yellow-100 hover:font-semibold"
          >
           <p class="cursor-p">{{ item.label }}</p>
        </div>
       </nav>
      </div>
    </div>
  </div>
</template>

<static-query>
  query{
    metadata{
      sitepath
    },
    allPage{
      path
      context
    }
  }
</static-query>

<script>

export default {
  path: "Nav",
  // components: { BookmarksMenu },
  data: function() {
    return {
      items: [
        { path: "/",
          label: "Home",
          type: 'local'
        },
        {
          path: "/master-detail",
          label: "Master Detail",
          type: 'local'
        },
        {
          path: "/hardocs-db",
          label: "Hardocs Db In-Out",
          type: 'local'
        },
        {
          path: "/docs-trans",
          label: "Translate Files",
          type: 'local'
        },
        {
          path: "/projects-admin",
          label: "Projects Admin",
          type: 'local'
        },
        {
          path: "https://www.google.com/search?q=oceanic&source=lnms&tbm=isch",
          label: "Remote Website",
          type: 'remote'
        },
        {
          path: "/documentation",
          label: "Documentation",
          type: 'local'
        },
        {
          path: "/about",
          label: "About",
          type: 'local'
        }
      ]
    }
  },
  methods: {
    handleMenu (item) {
      switch (item.type) {
        case 'local':
          // wouldn't want to re-push our current route...
          if (this.$router.currentRoute.path !== item.path) {
            this.$router.push(item.path)
          }
          break

        case 'remote':
        default:
          window.open (item.path, '_blank')
          break
      }
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
.cursor-p { /* because tailwind cursor-pointer won't take care of it */
  cursor:pointer;
}
</style>
