<script>

</script>

<template>
    <header>
        <nav class="container">
            <div class="branding">
                <img class="logo" src="/images/logo.png" alt="">
            </div>
            <ul class="nav-links">
                <h5>Bracket Helper</h5>
            </ul>
        </nav>
    </header>
</template>



<style lang="scss" scoped>
    header {
        background-color: #202020;
        nav {
            display: flex;
            align-items: center;
            padding: 0px 16px;
            color: rgb(216, 216, 216);

            .branding {
                display: flex;
                align-items: center;
                gap: 8px;

                img {
                    max-width: 300px
                }

                h1 {
                    font-size: 24px;
                }
            }

            .nav-links {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                gap: 12px;
                list-style: none;
                margin-bottom: 0px;
                margin-top: 10px;

                a {
                    text-decoration: none;
                    color: inherit;
                }

                .fileSelect {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: center;
                    align-items: center;

                    select {
                        width: 100%;
                        margin-right: 10px;
                    }

                    button {
                        width: 50%;
                        white-space: nowrap;
                    }
                }

            }
        }
    }
</style>