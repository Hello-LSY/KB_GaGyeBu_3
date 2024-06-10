<template>
  <div class="sidebarsection">
    <div class="sidebaritem">
      <div class="text">
        <div class="huge-icon-interface-solid-apps">
          <div class="apps2">
            <img class="comboshape" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZO7TcRAFEXPm9XmpgOXsHRAB9ABIkPaxK6A2QbAyUpkiA6gBCqADnAJjkHr4Q3SIjSej0ak3MDB+17rzZFtv7tE3AA0/JJzjILY/d3NI4G6zrafwgPCxvc5eJpn+vvBjrLt7bsmWuKa9rf2ZDHM8Boa8LWHmVOTGUakiQ9hiMV9bKWuDZUS4TydZFM9UDVlck39QOEtldJDPpvcRr3eGMbWB64SPdPs6IzTcxNp/G6a2YXBQZ/GWq/p3RzrdPGLv7B/NvzrzxL/ybEZNpTYNz9sCmfHIt1ysdLYteaWHpwlgp54hHWRKbHJ8p9a0mpMiU0qlSWFuPPCwAKb1A4ssRmLkzKgCJtaNkvsfwGphH/VjaXHQQAAAABJRU5ErkJggg==" />
          </div>
        </div>
        <router-link to="/" class="sidebar-link">Dashboards</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <div class="huge-icon-financeandpayment-solid-piechart">
          <div class="piechart2">
            <img class="comboshape2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGBSURBVHgBrZRBUsJAEEV/D6Db3MB4A72BOYF4AlkqLpjiAgx7q8hCq1jiCfQGcgRuYDyB2Qpl2m4lMVCEJIa/mZqk501PT88Hasha55XFECqqPxyPCOyYEcmqeZJgPA1dVAt4Y52voy68GzreERJ2BByGLk4/tLcj9FhL0IAMW5l6QhnL6LBbdknoysZBmq3J/70djuzK4E1gCiitl4oIfovwnM4zoNbIgCZVQZtUnPWtcxlQJj0tOBqIDAZaLrNOe4Tm8j4N94xmJyn7OIAM06WhFq73RvG6poQFSsR6WOmvD+y/iFh67VRjpEVCAXsFtDhh2DbKb9VbEV6/GFfTieuWxIIKXgAKspgX/XqcuEBHyZDfhXuCKiJcFHzP6muY6QUNJYbxBzQtNAaq82TAh3s3l9o84Z+SC5jlbeznpXTkumWIUFMCi/LZZUD1M+m1oA50DQu2TTZzG4FGAj0nbO64Q7HGHElsZccW1/CXRlqE0U1fxq/18+I4oVneobf1DcNjkModxSByAAAAAElFTkSuQmCC" />
          </div>
        </div>
        <router-link to="/analytics" class="sidebar-link">Analytics</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <div class="huge-icon-financeandpayment-solid-transfer">
          <div class="transfer2">
            <div class="comboshape3">
              <div class="rectangle921"></div>
              <div class="rectangle922"></div>
              <img class="vector-stroke" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC" />
              <img class="vector-stroke2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC" />
            </div>
          </div>
        </div>
        <router-link to="/transaction" class="sidebar-link">Transaction</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <img class="huge-icon-interface-solid-setting" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHFSURBVHgB7VVNTsJAFP7e+LfFE1hvgCvjDm7gEXAnYmLhAh0OINSEstUbeAVWJrrSG/QGdqkYZnxDi+lMW2nEJV/STOfxve/N+xkKbLEGVId07ctzLXDPrw2z1xqx0LiYhHK2zlegBjQhWIkvT0XwVBpwLUoDXPrS8325FOTV4zybLodTbxhexvl5L+HZ6PlyzGH99OiYZeKNMmdTKhZIVgfQiuQ0DIaVAbpcayHwiA1ACu18b6wSCcIYG0I7GnYPqLwU6U8Y7ikcmodl+qgmevntrhOf60fWxGT2/mQ0DHOG8GogGxw0cOSTVKMig4hFlEMw2FP04Nr2FULXpoF+ZB+kOKakKMEfoaELJbYCdAeBT6LY6Dmysc3hU+hOUYyCrh9YXGtMewP5joqZV0r3D5CWag66IaElypFEI3m42thNJsScZ7PMSwgafyHNjky1K6CXjc75WfqE6vGrCaFsjZ385uVpFp+etUzZWpnpjZ8PoPJ+JHziZ3bwzIb/Ou6iUP4+RZORlAuFY3OhuJZNXttw0l6BeSfTkWwZrvGZjmVhGGp9D3qDIGbqkeP5Gt3Kk3W+tb4HfDc6vMQ5U0ILDLHFf+AbXKCRdoHdi+cAAAAASUVORK5CYII=" />
        <router-link to="/settings" class="sidebar-link">Setting</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <img class="icon-round-account_circle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIaSURBVHgB3VTRcdpAEN09ia/kQ6kAqYK4g5AOoAOcYE9mgse4AqAC5Bklw8TEyBXY7oAS6EBSB3zb8q33hC0d0gmw/WW/GcFo792+u9O7B/DegdsGu4PIEffQtRC/AeIBELjrEVryT/wg6fbyrxe+SuBnP2ojiDkTHNgGYiGS4zohYSoenyQTAeJ6Z/P1El1LiHmvnwz3EjhmIhEMqn1g/MmWX9SDBGeG8VGPF2aoF/hxEnUtEvMyiQXPZn+a/uZCohGBqKxaguz8D7wb4w4swwSFtCHDcu3OBt/E5aOdK3MU79rqC5e8CY7NzqsIWFK062bYafWb6E2qEK2cl9cQmnV0tuuw9ztapQ0I14LiVH3Uej58rQoAHMAWIIpJI4UJ7AMsjlrAC0BACf+tXjJHlCaXwc3kOYH8rvw/C1z3Imhmd0HVCODK3DaLkgz5ESHhUv8OfI5LkcrOdOrF5em+76ldLNTzaxCNHlJxDdoRE2Fi2IFc6E3qmpcx9b3YsmVHryHJ6kV7ckh+vqkFbdgT6X3B5RiJL7TgywVC3jZf88OcyK5haw5gBxRHcZ/fiZNVH6/E9VE/URFwmhcIQkJ5NQu8xUbjftTi6UMEbBVUGM+C5mirgAInKgcZbOQSv68QKOatORx+jiHKz9lhphQ244izSd1g2p1PLCwP/2kJupeALkScU4jkMj2LgOzOKFuz8z6zOZ5s+0HxCEXx0yRldvQ4AAAAAElFTkSuQmCC" />
        <router-link to="/profile" class="sidebar-link">Profile</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <router-link to="/transaction/regist" class="sidebar-link">Regist Transaction</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <router-link to="/register" class="sidebar-link">Regist</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <router-link to="/login" class="sidebar-link">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebarsection {
  width: 200px;
  background-color: #f4f4f4;
  padding: 10px;
  height: 100vh; /* Ensure the sidebar takes the full height */
  overflow-y: auto; /* Allow scrolling if content overflows */
}

.sidebaritem {
  margin-bottom: 15px;
}

.sidebar-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 10px;
}

.sidebar-link:hover {
  background-color: #e0e0e0;
}

.text {
  display: flex;
  align-items: center;
}

.text img {
  margin-right: 10px;
}
</style>
