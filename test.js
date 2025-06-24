const array=[4,3,2,10,5,7,2,1,4]
const sort=(array)=>
    {
        let check,j;
        for(let i=1;i<array.length;i++)
            {
                check=array[i]
                j=[i]
                while(j>0 && a[j-1]<check)
                    {
                        a[j]=a[j-1]
                        j=[j-1]
                    }
                    a[j-1]=check
            }
    }
sort(array)
throw(array)