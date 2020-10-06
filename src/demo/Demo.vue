<template>
  <div class="home-main">
    <Menus />
    <div class="hero">
      <img
        src="/social-media-logo-small.png"
      >
      <div class="github">
        <!-- Place this tag where you want the button to render. -->
        <iframe
          src="https://ghbtns.com/github-btn.html?user=prabhuignoto&repo=vue-float-menu&type=star&count=true&size=large"
          frameborder="0"
          scrolling="0"
          width="150"
          height="30"
          title="GitHub"
        />
        <iframe
          src="https://ghbtns.com/github-btn.html?user=prabhuignoto&repo=vue-float-menu&type=fork&count=true&size=large"
          frameborder="0"
          scrolling="0"
          width="170"
          height="30"
          title="GitHub"
        />
      </div>
      <div class="feature-set">
        <ul>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="drag"
            >👌</span>&nbsp;
            <span class="name">Drag and place anywhere on screen.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="orientation"
            >👓</span>
            <span class="name">Optimal menu orientation.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="nested menus"
            >👍</span>
            <span class="name">Support for nested menus.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="keyboard accessible"
            >⌨</span>
            <span class="name">Keyboard Accessible.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="themes"
            >🌈</span>
            <span class="name">Support for custom themes.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="typescript"
            >💪</span>
            <span class="name">Built with Typescript.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="intuitive API"
            >🧰</span>
            <span class="name">Intuitive API with data driven behavior.</span>
          </li>
          <li>
            <span
              class="icon"
              role="img"
              aria-label="built with Vue 3"
            >🌠</span>
            <span class="name">Built with the all new Vue 3.</span>
          </li>
        </ul>
      </div>
      <footer>
        <a
          href="https://www.prabhumurthy.com"
          target="_new"
        >&copy; {{ new Date().getFullYear() }} www.prabhumurthy.com</a>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Menus from "./Menus.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Menus,
  },
  setup() {
    const handleSelection = (name: string) => {
      console.log(name);
    };

    return {
      handleSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 100%;
  border-radius: 8px;
}

.home-main {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.hero {
  width: 650px;

  img {
    filter: drop-shadow(2px 2px 60px rgba(0, 0, 0, 0.25));
  }
}

.github {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}

.feature-set {
  font-size: 0.95rem;
  margin-top: 1rem;

  ul {
    list-style: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;

    li {
      margin: 1rem 0;
      flex-basis: 47%;
      text-align: left;
      background: #fff;
      height: 4rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem 0;
    }

    .icon {
      font-size: 1.5rem;
      margin-left: 0.5rem;
      margin-right: 0.3rem;
    }

    .name {
      flex: auto;
    }
  }
}

footer {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
