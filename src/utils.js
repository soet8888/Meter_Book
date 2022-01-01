export const formatMoney = (amount = 0) => {
    return parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').split('.')[0];
}

export const chunk = (data = [], count = 0) => {
    const result = data.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / count)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, []);
    return result
}

export const getMilliseconds=()=> {
    return  (new Date()).getTime();
}