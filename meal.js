class NeisService {
    constructor() { }

    async getDietInfo(dayString) {
        const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.NEIS_API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7531328&MLSV_YMD=${dayString}`;
        const response = await fetch(url);

        return response.json();
    }

    async getDiet(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayString = `${year}${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`;

        try {
            const dietInfo = (await this.getDietInfo(dayString))
                .mealServiceDietInfo[1].row[0];

            const diet = dietInfo.DDISH_NM.split('<br/>').map((item) =>
                item.trim(),
            );
            const kcal = dietInfo.CAL_INFO;


            const result = [
                true,
                `${month}월 ${day}일 급식`,
                `${diet}\n\n${kcal}`,
            ];

            return result;
        } catch (error) {
            // console.error(error);
            return [
                false,
                `${month}월 ${day}일 급식`
            ];
        }
    }
}

module.exports = NeisService;