title: getMeasured
date: 2016-07-24 18:24:06
tags:
- android
categories: android
---


- public final int getMeasuredHeight ()

Added in API level 1
Like getMeasuredHeightAndState(), but only returns the raw width component (that is the result is masked by MEASURED_SIZE_MASK).

Returns:


**The raw measured height of this view.**


- public final int getMeasuredHeightAndState ()

Added in API level 11
<!--more-->
Return the full height measurement information for this view as computed by the most recent call to measure(int, int). This result is a bit mask as defined by MEASURED_SIZE_MASK and MEASURED_STATE_TOO_SMALL. This should be used during measurement and layout calculations only. Use getHeight() to see how wide a view is after layout.

Returns:

**The measured width of this view as a bit mask.**

- public final int getHeight ()

Added in API level 1
Return the height of your view.

Returns:


**The height of your view, in pixels.**


以上3个View类的方法中，前两个是一类的，只不过返回的数据形式不一样。对比这两类，

- getMeasuredHeight

返回控件的实际高度；


- getHeight

返回控件在屏幕中的高度

所以如果控件可以包裹在屏幕内的话，两个函数的返回值相同，而一旦view过大，则getMeasuredHeight()等于getHeight()加上屏幕之外没有显示的高度。

