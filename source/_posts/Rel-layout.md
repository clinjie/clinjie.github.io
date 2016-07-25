title: LayoutParams
date: 2016-07-24 18:24:06
toc: true
tags:
- android
categories: android
---


# RelativeLayout.LayoutParams #

Per-child layout information associated with RelativeLayout.

- Constructor


`RelativeLayout.LayoutParams layoutParams = new LayoutParams(width, height);`

构造函数，设置相对布局的宽高。


- layoutParams.rightMargin

一系列的Margin属性设置，设置right、left、top、bottom方向的Margin.

- addRule 

`public void addRule (int verb)`
<!--more-->
Added in API level 1
Adds a layout rule to be interpreted by the RelativeLayout. This method should only be used for constraints that don't refer to another sibling (e.g., CENTER_IN_PARENT) or take a boolean value (TRUE for true or 0 for false). To specify a verb that takes a subject, use addRule(int, int) instead.

Parameters
`verb`	One of the verbs defined by RelativeLayout, such as ALIGN_WITH_PARENT_LEFT.

`public void addRule (int verb, int anchor)`

Added in API level 1
Adds a layout rule to be interpreted by the RelativeLayout. Use this for verbs that take a target, such as a sibling (ALIGN_RIGHT) or a boolean value (VISIBLE).

Parameters
`verb`	One of the verbs defined by RelativeLayout, such as ALIGN_WITH_PARENT_LEFT.
`anchor`	The id of another view to use as an anchor, or a boolean value (represented as TRUE for true or 0 for false). For verbs that don't refer to another sibling (for example, ALIGN_WITH_PARENT_BOTTOM) just use -1.


# 例子 #

`layoutParams.addRule(RIGHT_OF, items[i - 1].getId());`

上面的函数设置当前控件在 `items[i-1].getId()`这个Id对应控件的右侧



