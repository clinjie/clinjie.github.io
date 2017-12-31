title: 模拟退火
date: 2016-03-27 21:35:02
tags: 
- 算法
categories: 算法
---

# 模拟退火算法概述 #

模拟退火算法来源于固体退火原理，将固体加温至充分高，再让其徐徐冷却，加温时，固体内部粒子随温升变为无序状，内能增大，而徐徐冷却时粒子渐趋有序，在每个温度都达到平衡态，最后在常温时达到基态，内能减为最小。根据`Metropolis`准则，粒子在温度T时趋于平衡的概率为`e-ΔE/(kT)`，其中E为温度T时的内能，ΔE为其改变量，k为`Boltzmann`常数。<!--more-->用固体退火模拟组合优化问题，将内能E模拟为目标函数值f，温度T演化成控制参数t，即得到解组合优化问题的模拟退火算法：由初始解i和控制参数初值t开始，对当前解重复“产生新解→计算目标函数差→接受或舍弃”的迭代，并逐步衰减t值，算法终止时的当前解即为所得近似最优解，这是基于蒙特卡罗迭代求解法的一种启发式随机搜索过程。退火过程由冷却进度表(Cooling Schedule)控制，包括控制参数的初值t及其衰减因子Δt、每个t值时的迭代次数L和停止条件S。

# 流程图 #

![模拟退火](http://7xowaa.com1.z0.glb.clouddn.com/sa.jpg)

# 代码实现 #

## 伪代码 ##

```C
Simulated-Annealing()    
Create initial solution S    
repeat    
    for i=1 to iteration-length do    
        Generate a random transition from S to Si    
        If ( C(S) <= C(Si) ) then    
            S=Si    
        else if( exp(C(S)-C(Si))/kt > random[0,1) ) then    
            S=Si    
    Reduce Temperature t    
until ( no change in C(S) )    
    
C(S): Cost or Loss function of Solution S 
```

## java实例实现 ##

```java
package space.peihao;    
    
import java.io.BufferedReader;    
import java.io.File;    
import java.io.FileReader;    
import java.io.IOException;    
import java.util.Arrays;    
import java.util.Random;    
    
/**  
 * @author Dukie 下午02:22:13 2010  
 *   
 */    
public class Anneal {    
    
    private  static double[][] city;    
    private  static int[] currPath;    
    private  static int[] bestPath;    
    private  static double shortesDistance;    
    private  static int numOfCity = 20;    
    //trace item    
    private static int iterator = 0;    
    
    public void printInfo() {    
        System.out.println("bestPath: " + Arrays.toString(bestPath));    
        System.out.println("shortest distance: " + shortesDistance);    
        System.out.println("iterator times: " + iterator);    
    }    
    
    private void init() throws IOException {    
        city = new double[numOfCity][numOfCity];    
        currPath = new int[numOfCity];    
        bestPath = new int[numOfCity];    
        shortesDistance = 0;    
        loadCity();    
        int lenth = currPath.length;    
        for (int i = 0; i < lenth; i++) {    
            currPath[i] = i;    
        }    
    }    
    
    private void loadCity() throws IOException {    
        //DistanceMatrix.csv" a file stores the distance info.    
        File file = new File("E:\\TSP\\DistanceMatrix.csv");    
        inputGraph(file, city);    
    }    
    
    private void inputGraph(File file, double[][] city) throws IOException {    
        BufferedReader in = new BufferedReader(new FileReader(file));    
        String str = "";    
        int length = 0;    
        while ((str = in.readLine()) != null) {    
            str = str.replaceAll(", ", ",");    
            String[] line = str.split(",");    
            for (int j = 0; j < numOfCity; j++)    
                // ten cities    
                city[length][j] = Double.parseDouble(line[j]);    
            length++;    
        }    
    }    
    
    /**  
     * key function  
     * @throws IOException  
     */    
    public void anneal() throws IOException {    
    
        double temperature = 10000.0D;    
        double deltaDistance = 0.0D;    
        double coolingRate = 0.9999;    
        double absoluteTemperature = 0.00001;    
    
        init();    
    
        double distance = getToatalDistance(currPath);    
    
        int[] nextPath;     
        Random random = new Random();    
        while (temperature > absoluteTemperature) {    
            nextPath = generateNextPath();    
            deltaDistance = getToatalDistance(nextPath) - distance;    
    
            if ((deltaDistance < 0)    
                    || (distance > 0 &&     
                          Math.exp(-deltaDistance / temperature) > random.nextDouble())) {    
                currPath = Arrays.copyOf(nextPath, nextPath.length);    
                distance = deltaDistance + distance;    
            }    
    
            temperature *= coolingRate;    
            iterator++;    
            System.out.println("iterator: " + iterator + " path: " + Arrays.toString(currPath));    
        }    
        shortesDistance = distance;    
        System.arraycopy(currPath, 0, bestPath, 0, currPath.length);    
    
    }    
    
    /**  
     * calculate total distance  
     * @param currPath  
     * @return  
     */    
    private double getToatalDistance(int[] currPath) {    
        int length = currPath.length;    
        double totalDistance = 0.0D;    
        for (int i = 0; i < length - 1; i++) {    
            totalDistance += city[currPath[i]][currPath[i + 1]];    
        }    
        totalDistance += city[currPath[length - 1]][0];    
    
        return totalDistance;    
    }    
    
    /**  
     * swap two elements in the old array to genreate new array  
     * @return  
     */    
    private int[] generateNextPath() {    
        int[] nextPath = Arrays.copyOf(currPath, currPath.length);    
        Random random = new Random();    
        int length = nextPath.length;    
        int fistIndex = random.nextInt(length - 1) + 1;    
        int secIndex = random.nextInt(length - 1) + 1;    
        while (fistIndex == secIndex) {    
            secIndex = random.nextInt(length - 1) + 1;    
        }    
        int tmp = nextPath[fistIndex];    
        nextPath[fistIndex] = currPath[secIndex];    
        nextPath[secIndex] = tmp;    
    
        return nextPath;    
    }    
    
}    
```

上述代码就是为了解决旅行商问题。旅行商按一定的顺序访问N个城市的每个城市,使得每个城市都能被访问且仅能被访问一次,最后回到起点,而使花费的代价最小。本例中从第0个城市开始然后回到原点.

## Tips ##

模拟退火算法与初始值无关，算法求得的解与初始解状态S(是算法迭代的起点)无关；模拟退火算法具有渐近收敛性，已在理论上被证明是一种以概率l 收敛于全局最优解的全局优化算法；模拟退火算法具有并行性。