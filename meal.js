class NeisService {
    constructor() { }

    async getDietInfo(today) {
        const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.NEIS_API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7531328&MLSV_YMD=${today}`;
        const response = await fetch(url);

        return response.json();
    }

    async getDiet(month, day) {
        try {
            console.log(Object.keys((await this.getDietInfo(day))))
            console.log((await this.getDietInfo(day)).length)
            const dietInfo = (await this.getDietInfo(day))
                .mealServiceDietInfo[1].row[0];

            const diet = dietInfo.DDISH_NM.split('<br/>').map((item) =>
                item.trim(),
            );
            const kcal = dietInfo.CAL_INFO;

            const result = {
                status: true,
                title: `${month}월 ${day}일 급식`,
                diet,
                kcal,
            };

            return result;
        } catch (error) {
            console.error(error);
            return {
                status: false,
            };
        }
    }
}

module.exports = NeisService;