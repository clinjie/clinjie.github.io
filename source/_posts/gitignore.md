title: gitignore忽略规则
date: 2016-04-05 16:17:22
toc: true
tags: Git
categories: Git
---

.gitignore 配置文件用于配置不需要加入版本管理的文件，配置好该文件可以为我们的版本管理带来很大的便利，以下是个人对于配置 .gitignore 的一些心得。

# 配置语法 #


- 以斜杠“/”开头表示目录；

- 以星号“*”通配多个字符；
<!--more-->
- 以问号“?”通配单个字符

- 以方括号“[]”包含单个字符的匹配列表；

- 以叹号“!”表示是跟踪（不忽略）某个文件或目录。；

- `#此为注释 – 将被 Git 忽略`

- [ ^abc]：代表必须不是a,b,c中任一字符

- [abc]：代表a,b,c中任一字符即可

- {ab,bb,cx}：代表ab,bb,cx中任一类型即可

- {!ab}：必须不是此类型    
 


　　

此外，git 对于 .ignore 配置文件是按行从上到下进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效；

# 示例 #

1. `fd1/*`
说明：忽略目录 fd1 下的全部内容；注意，不管是根目录下的 /fd1/ 目录，还是某个子目录 /child/fd1/ 目录，都会被忽略；

2. `/fd1/*`
说明：忽略根目录下的 /fd1/ 目录的全部内容；

3.
```
/*
!.gitignore
!/fw/bin/
!/fw/sf/
```

4.

```html
*.a       #忽略所有 .a 结尾的文件
!lib.a    #但 lib.a 除外
/TODO     #仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/    #忽略 build/ 目录下的所有文件
doc/*.txt #会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```

说明：忽略全部内容，但是不忽略 .gitignore 文件、根目录下的 /fw/bin/ 和 /fw/sf/ 目录


# Tip #

规则很简单，但是有时候在项目开发过程中，突然心血来潮想把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效。原因是.gitignore只能忽略那些原来没有被track（跟踪过）的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交。

```
git rm -r --cached .gitignore #从版本库中删除文件，但不从硬盘删除
git add .gitignore
git commit -m 'update .gitignore'
```

或者直接

`git rm <file>  #从版本库中删除文件，同时在硬盘中剔除`