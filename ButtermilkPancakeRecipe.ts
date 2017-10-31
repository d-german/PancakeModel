module PancakeModel {
    export class ButtermilkPancakeRecipe {
        private static EggPerPancake: number = 1m / 6m;
        private static CupsButterMilkPerPancake: number = 1m / 6m;
        private static CupsOilPerPancake: number = 1m / 24m;
        private static TspsBakinPowerSodaPercake: number = 1m / 6m;
        private static CupsFlourPerPancake: number = 1m / 6m;
        private static CupsSugerPerPancake: number = 1m / 24m;
        private static NumberTspsPerCup: number = 48m;
        private static NumPoundsPerCupFlour: number = 80m / 250m;
        private static NumPoundsPerCupSugar: number = 0.54283m;
        private static FlOzStr: string = " ( {0} fl oz )";
        private static PoundsStr: string = " ( {0} lbs )";
        private static CommonFracs: number[] = new Array(0m,
            1m / 8m,
            1m / 4m,
            1m / 3m,
            1m / 2m,
            2m / 3m,
            3m / 4m,
            1m);
        private _galsAndCupsResult: VolumnAmountResult;
        private _numPancakes: number;
        private _tspAndTbspResult: VolumnAmountResult;
        constructor(numPancakes: number = 0m) {
            this._numPancakes = numPancakes;
            this._tspAndTbspResult = __init(new VolumnAmountResult(), { NameU1: "tbsp", NameU2: "tsp" });
            this._galsAndCupsResult = __init(new VolumnAmountResult(), { NameU1: "gallon", NameU2: "cup" });
            this.CalcRecipe();
        }
        public NumEggs: number;
        public NumCupsButtermilk: number;
        public NumCupsOil: number;
        public NumCupsFlower: number;
        public NumTspBakingSoda: number;
        public NumTspBakingPowder: number;
        public NumCupsSugar: number;
        public Recipe: string;
        public get NumberPancakes(): number {
            return this._numPancakes;
        }
        public set NumberPancakes(value: number) {
            this._numPancakes = value;
            this.CalcRecipe();
        }
        public GetEggsAmount(): string {
            return Eggs.GetQuantity(<number>this.NumEggs);
        }
        public async GetEggsAmountAsync(): Task<string> {
            return await Task.Run(() => Eggs.GetQuantity(<number>this.NumEggs));
        }
        public GetBakingSodaAmount(): string {
            return this.GetTspsAmount(this.NumTspBakingSoda);
        }
        public async GetBakingSodaAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetTspsAmount(this.NumTspBakingSoda));
        }
        public GetBakingPowderAmount(): string {
            return this.GetTspsAmount(this.NumTspBakingPowder);
        }
        public async GetBakingPowderAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetTspsAmount(this.NumTspBakingPowder));
        }
        public GetButtermilkAmount(): string {
            return this.GetCupsAmount(this.NumCupsButtermilk);
        }
        public async GetButtermilkAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetCupsAmount(this.NumCupsButtermilk));
        }
        public GetSugerAmount(): string {
            return this.GetCupsAmount(this.NumCupsSugar) + PancakeModel.ButtermilkPancakeRecipe.GetPoundsSugarAmount(this.NumCupsSugar);
        }
        public async GetSugerAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetCupsAmount(this.NumCupsSugar) + PancakeModel.ButtermilkPancakeRecipe.GetPoundsSugarAmount(this.NumCupsSugar));
        }
        public static GetPoundsSugarAmount(numCupsSugar: number): string {
            return string.Format(PancakeModel.ButtermilkPancakeRecipe.PoundsStr, (numCupsSugar * PancakeModel.ButtermilkPancakeRecipe.NumPoundsPerCupSugar).Round(2));
        }
        public GetFlourAmount(): string {
            return this.GetCupsAmount(this.NumCupsFlower) + PancakeModel.ButtermilkPancakeRecipe.GetPoundsFlourAmount(this.NumCupsFlower);
        }
        public async GetFlourAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetCupsAmount(this.NumCupsFlower) + PancakeModel.ButtermilkPancakeRecipe.GetPoundsFlourAmount(this.NumCupsFlower));
        }
        public static GetPoundsFlourAmount(numCupsFlour: number): string {
            return string.Format(PancakeModel.ButtermilkPancakeRecipe.PoundsStr, (numCupsFlour * PancakeModel.ButtermilkPancakeRecipe.NumPoundsPerCupFlour).Round(1));
        }
        public GetOilAmount(): string {
            return this.GetCupsAmount(this.NumCupsOil) + this.GetFlOz(this.NumCupsOil);
        }
        public async GetOilAmountAsync(): Task<string> {
            return await Task.Run(() => this.GetCupsAmount(this.NumCupsOil) + this.GetFlOz(this.NumCupsOil));
        }
        public GetFlOz(numCups: number): string {
            return string.Format(PancakeModel.ButtermilkPancakeRecipe.FlOzStr, (numCups * 8m).Round(1));
        }
        public GetCupsAmount(numCups: number): string {
            var galsAndCups = new CupsAndGallons(new Cups(numCups));
            var gals = galsAndCups.CalculatedGals;
            var cups = galsAndCups.CalculatedCups;
            var tspsAmount = string.Empty;
            var fp = cups.FractionalPart();
            if (fp < 0.25m && fp > 0)
            {
                var numTsps = fp * PancakeModel.ButtermilkPancakeRecipe.NumberTspsPerCup;
                cups = cups.IntegralPart();
                tspsAmount = GetTspsAmount(numTsps);
            }
            var cupsResult = this._galsAndCupsResult.GetVolumnAmount(GetCommonFracMeasure(gals),
                GetCommonFracMeasure(cups));
            if (tspsAmount.Equals("0")) {
                tspsAmount = string.Empty;
            }
            if (cupsResult.Equals("0")) {
                cupsResult = string.Empty;
            }
            return (cupsResult + " " + tspsAmount).Trim();
        }
        public GetTspsAmount(numTsps: number): string {
            var cupAmount = string.Empty;
            var oneForth: number = 0.25m;
            var numTspsPerOneForthCup: number = 12;
            if (numTsps >= numTspsPerOneForthCup) {
                var numCups = numTsps / PancakeModel.ButtermilkPancakeRecipe.NumberTspsPerCup;
                var calculatedNumCups = 0m;
                while (numCups > oneForth) {
                    numCups -= oneForth;
                    calculatedNumCups += oneForth;
                }
                cupAmount = this.GetCupsAmount(calculatedNumCups);
                numTsps = numCups * PancakeModel.ButtermilkPancakeRecipe.NumberTspsPerCup;
            }
            var tspAndTbsp = new TspAndTbsp(new Tsp(numTsps));
            var tbsp = GetCommonFracMeasure(tspAndTbsp.CalculatedTbsps);
            var tsps = GetCommonFracMeasure(tspAndTbsp.CalculatedTsps);
            var tspAmount = this._tspAndTbspResult.GetVolumnAmount(tbsp, tsps);
            if (tspAmount.Equals("0")) {
                tspAmount = string.Empty;
            }
            if (cupAmount.Equals("0")) {
                cupAmount = string.Empty;
            }
            return (cupAmount + " " + tspAmount).Trim();
        }
        public static ToTsp(cup: Cups): Tsp {
            return new Tsp(cup.Value * PancakeModel.ButtermilkPancakeRecipe.NumberTspsPerCup);
        }
        private CalcRecipe(): void {
            this.NumEggs = Decimal.Truncate(ButtermilkPancakeRecipe.EggPerPancake * this._numPancakes);
            this.NumCupsButtermilk = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.CupsButterMilkPerPancake);
            this.NumCupsOil = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.CupsOilPerPancake);
            this.NumTspBakingPowder = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.TspsBakinPowerSodaPercake);
            this.NumTspBakingSoda = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.TspsBakinPowerSodaPercake);
            this.NumCupsFlower = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.CupsFlourPerPancake);
            this.NumCupsSugar = (this._numPancakes * PancakeModel.ButtermilkPancakeRecipe.CupsSugerPerPancake);
            this.Recipe = this.ToString();
        }
        public ToString(): string {
            var buf = new StringBuilder();
            buf.AppendLine("Number of Pancakes: " + this.NumberPancakes);
            buf.AppendLine("");
            buf.AppendLine("Eggs: " + this.NumEggs);
            buf.AppendLine("Buttermilk: " + this.GetButtermilkAmount());
            buf.AppendLine("Oil: " + this.GetOilAmount());
            buf.AppendLine("Baking Powder: " + this.GetBakingPowderAmount());
            buf.AppendLine("Baking Soda: " + this.GetBakingSodaAmount());
            buf.AppendLine("Flour: " + this.GetFlourAmount());
            buf.AppendLine("Sugar: " + this.GetBakingPowderAmount());
            return buf.ToString();
        }
        private static GetCommonFracMeasure(num: number): number {
            var ip = num.IntegralPart();
            var fp = Frac2ClosestMatchFrac(num.FractionalPart());
            return ip + fp;
        }
        public static Frac2ClosestMatchFrac(num: number): number {
            var target = num.FractionalPart();
            var closest = PancakeModel.ButtermilkPancakeRecipe.CommonFracs.Select(n => new { n, distance = Math.Abs(n - target) }).OrderBy(p => p.distance).First().n;
            return closest;
        }
    }
}