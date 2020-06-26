<template>
  <div>
<!--    <router-view>-->
<!--      <router-link to="/">Homey</router-link>-->
<!--      <router-link to="/data-view">Data Viewey</router-link>-->
<!--    </router-view>-->
<!--<div style="height: 100px"><h2>Spacer temp</h2></div>-->
    <div class="navbar nav-bg bg-opacity-100 w-screen h-16 fixed top-0 text-white hidden md:block z-20">
      <div class="container mx-auto max-w-5xl flex items-center h-full ">
       <nav class="flex">
         <div
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
// import { mapState, mapMutations } from "vuex";
// import { mdiDotsVertical, mdiDotsHorizontal } from "@mdi/js";
// import BookmarksMenu from "./BookmarksMenu";
// import store from "~/store";

export default {
  name: "Nav",
  // components: { BookmarksMenu },
  data: function() {
    return {
      scrollPosition: null,
      homePage: false,
      isOpen: false,
      // ccwhIcon: "/resources/images/combatcovid.png",
      // extrasIcon: mdiDotsVertical,
      // designIcon: mdiDotsHorizontal,
      items: [
        { name: "/",
          label: "Home",
          type: 'local'
        },
        {
          name: "/data-view",
          label: "Data View",
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
    };
  },
  computed: {
    // ...mapState(["currentPage"]),
    hideWhen: function() {
      if (typeof window !== "undefined") {
        const w =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        return w <= 640;
      } else {
        return false;
      }
    },
    designRemembered: function() {
      return null // store.getters.lastRepoName;
    },
    currentPage:() => {
      return `${window.location.pathname}`;
    }
  },
  methods: {
    changeOnScroll() {
      /** Here we do it when is mounted with vanilla javascript */
      let nav = document.getElementsByClassName("navbar");
      let state = window.scrollY;

      const isHomePage = window.location.pathname === "/";
      if (state > 20 && isHomePage) {
        nav.forEach(item => item.classList.add("bg-primary-100"));
      } else {
        if (state < 20 && isHomePage) {
          nav.forEach(item => item.classList.remove("bg-primary-100"));
        }
      }
    },
    toggleMenu: function() {
      this.isOpen = !this.isOpen;
    },
    setCurrentPage(){
      // store.dispatch('setPagePath', this.currentPage) // _never_ commit directly from Vue...
    }
  },
  mounted() {
    // this.setCurrentPage();
    // let nav = document.getElementsByClassName("navbar");
    // let home = this.$el.querySelector("#Home");
    // // console.log(home.classList.contains("font-semibold"));
    // if (home.classList.contains("font-semibold")) {
    //   window.addEventListener("scroll", this.changeOnScroll);
    // }
    // if (window.location.pathname !== "/") {
    //   nav.forEach(item => item.classList.add("bg-primary-100"));
    // }
    // // else if(home.classList.contains('font-semibold')== false){
    // //   nav.classList.remove('bg-image')
    // //   // window.removeEventListener('scroll', this.changeOnScroll);
    // // }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 64rem;
}
.test {
  color: red !important;
}

.router-link-active {
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
