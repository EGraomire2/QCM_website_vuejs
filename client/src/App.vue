<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  created() {
    const token = localStorage.getItem('token');

    const getCurrentPath = () => {
      // prefer router-aware path
      if (this.$route && this.$route.path) return this.$route.path;
      // hash-mode fallback (#/path)
      const hash = window.location.hash;
      if (hash) {
        const m = hash.match(/^#\/?([^?]*)/);
        if (m) return '/' + m[1];
      }
      // normal pathname
      return window.location.pathname || '/';
    };

    const normalize = p => p.startsWith('/') ? p : `/${p}`;

    const goTo = (path) => {
      const target = normalize(path);
      const current = normalize(getCurrentPath());
      if (current === target) return; // already there -> éviter la boucle

      if (this.$router && typeof this.$router.replace === 'function') {
        this.$router.replace(target).catch(()=>{});
      } else {
        // fallback: use replace to avoid history entries
        const prefix = window.location.hash ? '#' : '';
        window.location.replace(`${window.location.origin}/${prefix}${target.replace(/^\//,'')}`);
      }
    };

    if (!token) {
      goTo('/login');
      return;
    }

    // valider le token côté serveur
    fetch('http://localhost:3000/api/authenticate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) throw new Error('Not authenticated');
      return resp.json();
    })
    .then(data => {
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      goTo('/'); // page index
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      goTo('/login');
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
