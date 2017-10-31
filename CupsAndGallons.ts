module PancakeModel {
    export class CupsAndGallons {
        private static HalfGallon: number = 8m;
        private static Gallon: number = 16m;
        private static Half: number = 0.5m;
        private static One: number = 1;
        constructor(cups: Cups) {
            CalcCupsAndGallons(cups.Value);
        }
        public CalculatedGals: number;
        public CalculatedCups: number;
        private CalcCupsAndGallons(numCups: number): void {
            if (numCups < CupsAndGallons.HalfGallon) {
                this.CalculatedCups += numCups;
                return
            }
            if (numCups == CupsAndGallons.HalfGallon) {
                this.CalculatedGals += CupsAndGallons.Half;
                return
            }
            if (numCups == CupsAndGallons.Gallon) {
                this.CalculatedGals += CupsAndGallons.One;
                return
            }
            if (numCups > CupsAndGallons.HalfGallon && numCups < CupsAndGallons.Gallon) {
                this.CalculatedGals += CupsAndGallons.Half;
                this.CalculatedCups += numCups - CupsAndGallons.HalfGallon;
                return
            }
            if (numCups <= CupsAndGallons.Gallon)
                return
            this.CalculatedCups += numCups.FractionalPart();
            var ip = numCups.IntegralPart();
            while (ip > CupsAndGallons.Gallon) {
                this.CalculatedGals += CupsAndGallons.One;
                ip -= CupsAndGallons.Gallon;
            }
            CalcCupsAndGallons(ip);
        }
    }
}