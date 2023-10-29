//webpack配置

// config.module.rule("svg").exclude.add(resolve("src/assets/svg")).end();
// config.module
//     .rule("svg-sprite")
//     .test(/\.svg$/)
//     .include.add(resolve("src/assets/svg"))
//     .end()
//     .use("svg-sprite-loader")
//     .loader("svg-sprite-loader")
//     .options({
//         symbolId: "icon-[name]",
//         include: ["src/assets/svg"],
//     })
//     .end();



//使用示例

<wb-icon
    icon="task-merge"
    class="wb"
/>

