import * as path from 'path'
import * as fs from 'fs'

export default function includeAndFixImages() {
    return {
        name: 'include-and-fix-images',
        enforce: 'pre',
        transform(src, id) {
            if (!id.endsWith('.md')) return src

            // 匹配形如 <!--@include: 路径/文件.md--> 的指令
            const includeRegex = /<!--\s*@include:\s*(.+?\.md)\s*-->/g
            let modified = src
            let match

            while ((match = includeRegex.exec(src)) !== null) {
                const includePath = match[1].trim()
                // 根据当前主文档所在目录解析被包含文件的绝对路径
                const absoluteIncludePath = path.resolve(path.dirname(id), includePath)
                if (fs.existsSync(absoluteIncludePath)) {
                    let fileContent = fs.readFileSync(absoluteIncludePath, 'utf-8')
                    // 被包含文件所在目录
                    const includedDir = path.dirname(absoluteIncludePath)
                    // 处理 Markdown 图片语法： ![alt](url)
                    // 只处理非绝对链接（不以 "/" 或 "http(s)://" 开头）的路径
                    fileContent = fileContent.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (m, p1, p2, p3) => {
                        if (/^(\/|https?:\/\/)/.test(p2)) {
                            return m
                        }
                        const absoluteImagePath = path.join(includedDir, p2)
                        const docsDir = path.join(process.cwd(), 'docs')
                        let newPath = path.relative(docsDir, absoluteImagePath)
                        newPath = '/' + newPath.split(path.sep).join('/')
                        return `${p1}${newPath}${p3}`
                    })
                    modified = modified.replace(match[0], `\n${fileContent}\n`)
                }
            }
            return modified
        }
    }
}
