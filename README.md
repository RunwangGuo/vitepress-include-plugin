# vitepress-include-plugin

## 解决的问题：

​	一般我们在使用md时候引用图片一般都是使用相对路径，但是在一个 markdown 文件中包含另一个 markdown 文件，这样会导致图片无法正常显示。

## 解决思路：

​	处理 include 指令时读取被包含的 Markdown 文件内容，扫描其中的图片链接，然后根据被包含文件所在的目录计算出图片的绝对路径，再将修改后的 Markdown 内容插入到主文档中。这样在最终渲染时，图片链接就已经是绝对路径了，所以被包含文件中只需要写相对路径。

## 使用示例：

```
npm i vitepress-include-plugin@1.0.2
```

修改「.vitepress/config.mts」文件

```
import { defineConfig } from 'vitepress'
import includeAndFixImages from 'vitepress-include-plugin'

export default defineConfig({
  vite: {
    plugins: [
      includeAndFixImages()
    ]
  }
})
```