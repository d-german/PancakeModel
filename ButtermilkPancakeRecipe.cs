using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PancakeModel
{
    public class ButtermilkPancakeRecipe
    {
        private const decimal EggPerPancake = 1m/6m;
        private const decimal CupsButterMilkPerPancake = 1m/6m;
        private const decimal CupsOilPerPancake = 1m/24m;
        private const decimal TspsBakinPowerSodaPercake = 1m/6m;
        private const decimal CupsFlourPerPancake = 1m/6m;
        private const decimal CupsSugerPerPancake = 1m/24m;
        private const decimal NumberTspsPerCup = 48m;
        private const decimal NumPoundsPerCupFlour = 80m/250m;
        private const decimal NumPoundsPerCupSugar = 0.54283m;
        private const string FlOzStr = " ( {0} fl oz )";
        private const string PoundsStr = " ( {0} lbs )";

        private static readonly decimal[] CommonFracs = new[]
                                                            {
                                                                0m,
                                                                1m/8m,
                                                                1m/4m,
                                                                1m/3m,
                                                                1m/2m,
                                                                2m/3m,
                                                                3m/4m,
                                                                1m
                                                            }; 

        private readonly VolumnAmountResult _galsAndCupsResult;
        private decimal _numPancakes;
        private readonly VolumnAmountResult _tspAndTbspResult;

        public ButtermilkPancakeRecipe(decimal numPancakes = 0m)
        {
            _numPancakes = numPancakes;
            _tspAndTbspResult = new VolumnAmountResult {NameU1 = "tbsp", NameU2 = "tsp"};
            _galsAndCupsResult = new VolumnAmountResult {NameU1 = "gallon", NameU2 = "cup"};
            CalcRecipe();
        }

        public decimal NumEggs { get; private set; }
        public decimal NumCupsButtermilk { get; private set; }
        public decimal NumCupsOil { get; private set; }
        public decimal NumCupsFlower { get; private set; }
        public decimal NumTspBakingSoda { get; private set; }
        public decimal NumTspBakingPowder { get; private set; }
        public decimal NumCupsSugar { get; private set; }
        public string Recipe { get; private set; }


        public decimal NumberPancakes
        {
            get
            {
                return _numPancakes;
            }
            set
            {
                _numPancakes = value;
                CalcRecipe();
            }
        }

        public string GetEggsAmount()
        {
            return Eggs.GetQuantity((int) NumEggs);
        }
        public async Task<string> GetEggsAmountAsync()
        {
            return await Task.Run(() => Eggs.GetQuantity((int)NumEggs));
        }

        public string GetBakingSodaAmount()
        {
            return GetTspsAmount(NumTspBakingSoda);
        }
        public async Task<string> GetBakingSodaAmountAsync()
        {
            return await Task.Run(() => GetTspsAmount(NumTspBakingSoda));
        }

        public string GetBakingPowderAmount()
        {
            return GetTspsAmount(NumTspBakingPowder);
        }
        public async Task<string> GetBakingPowderAmountAsync()
        {
            return await Task.Run(() => GetTspsAmount(NumTspBakingPowder));
        }

        public string GetButtermilkAmount()
        {
            return GetCupsAmount(NumCupsButtermilk);
        }
        public async Task<string> GetButtermilkAmountAsync()
        {
            return await Task.Run(() => GetCupsAmount(NumCupsButtermilk));
        }

        public string GetSugerAmount()
        {
            return GetCupsAmount(NumCupsSugar) + GetPoundsSugarAmount(NumCupsSugar);
        }

        public async Task<string> GetSugerAmountAsync()
        {
            return await Task.Run(() => GetCupsAmount(NumCupsSugar) + GetPoundsSugarAmount(NumCupsSugar)) ;
        }

        public static string GetPoundsSugarAmount(decimal numCupsSugar)
        {
            return string.Format(PoundsStr, (numCupsSugar*NumPoundsPerCupSugar).Round(2));
        }

        public string GetFlourAmount()
        {
            //http://www.traditionaloven.com/conversions_of_measures/flour_volume_weight.html
            return GetCupsAmount(NumCupsFlower) + GetPoundsFlourAmount(NumCupsFlower);
        }
        public async Task<string> GetFlourAmountAsync()
        {
            return await Task.Run(() => GetCupsAmount(NumCupsFlower) + GetPoundsFlourAmount(NumCupsFlower));
        }

        public static string GetPoundsFlourAmount(decimal numCupsFlour)
        {
            return string.Format(PoundsStr, (numCupsFlour*NumPoundsPerCupFlour).Round(1));
        }

        public string GetOilAmount()
        {
            return GetCupsAmount(NumCupsOil) + GetFlOz(NumCupsOil);
        }
        public async Task<string> GetOilAmountAsync()
        {
            return await Task.Run(() => GetCupsAmount(NumCupsOil) + GetFlOz(NumCupsOil));
        }

        public string GetFlOz(decimal numCups)
        {
            return string.Format(FlOzStr, (numCups*8m).Round(1));
        }

        public string GetCupsAmount(decimal numCups)
        {
            var galsAndCups = new CupsAndGallons(new Cups(numCups));
            var gals = galsAndCups.CalculatedGals;
            var cups = galsAndCups.CalculatedCups;
            var tspsAmount = string.Empty;

            var fp = cups.FractionalPart();

            if (fp < 0.25m && fp > 0)
            {
                var numTsps = fp*NumberTspsPerCup;
                cups = cups.IntegralPart();
                tspsAmount = GetTspsAmount(numTsps);
            }

            var cupsResult = _galsAndCupsResult.GetVolumnAmount(
                GetCommonFracMeasure(gals),
                GetCommonFracMeasure(cups));

            if (tspsAmount.Equals("0"))
            {
                tspsAmount = string.Empty;
            }

            if (cupsResult.Equals("0"))
            {
                cupsResult = string.Empty;
            }

            return (cupsResult + " " + tspsAmount).Trim();
        }

        public string GetTspsAmount(decimal numTsps)
        {
            var cupAmount = string.Empty;
            const decimal oneForth = 0.25m;
            const int numTspsPerOneForthCup = 12;

            if (numTsps >= numTspsPerOneForthCup)
            {
                var numCups = numTsps/NumberTspsPerCup;
                var calculatedNumCups = 0m;

                while (numCups > oneForth)
                {
                    numCups -= oneForth;
                    calculatedNumCups += oneForth;
                }

                cupAmount = GetCupsAmount(calculatedNumCups);
                numTsps = numCups*NumberTspsPerCup;
            }

            var tspAndTbsp = new TspAndTbsp(new Tsp(numTsps));
            var tbsp = GetCommonFracMeasure(tspAndTbsp.CalculatedTbsps);
            var tsps = GetCommonFracMeasure(tspAndTbsp.CalculatedTsps);

            var tspAmount = _tspAndTbspResult.GetVolumnAmount(tbsp, tsps);

            if (tspAmount.Equals("0"))
            {
                tspAmount = string.Empty;
            }

            if (cupAmount.Equals("0"))
            {
                cupAmount = string.Empty;
            }

            return (cupAmount + " " + tspAmount).Trim();
        }

        public static Tsp ToTsp(Cups cup)
        {
            return new Tsp(cup.Value*NumberTspsPerCup);
        }

        private void CalcRecipe()
        {
            NumEggs = Decimal.Truncate(EggPerPancake*_numPancakes);
            NumCupsButtermilk = (_numPancakes*CupsButterMilkPerPancake);
            NumCupsOil = (_numPancakes*CupsOilPerPancake);
            NumTspBakingPowder = (_numPancakes*TspsBakinPowerSodaPercake);
            NumTspBakingSoda = (_numPancakes*TspsBakinPowerSodaPercake);
            NumCupsFlower = (_numPancakes*CupsFlourPerPancake);
            NumCupsSugar = (_numPancakes*CupsSugerPerPancake);
            Recipe = ToString();
        }

        public override string ToString()
        {
            var buf = new StringBuilder();
            buf.AppendLine("Number of Pancakes: " + NumberPancakes);
            buf.AppendLine("");
            buf.AppendLine("Eggs: " + NumEggs);
            buf.AppendLine("Buttermilk: " + GetButtermilkAmount());
            buf.AppendLine("Oil: " + GetOilAmount());
            buf.AppendLine("Baking Powder: " + GetBakingPowderAmount());
            buf.AppendLine("Baking Soda: " + GetBakingSodaAmount());
            buf.AppendLine("Flour: " + GetFlourAmount());
            buf.AppendLine("Sugar: " + GetBakingPowderAmount());

            return buf.ToString();
        }

        private static decimal GetCommonFracMeasure(decimal num)
        {
            var ip = num.IntegralPart();
            var fp = Frac2ClosestMatchFrac(num.FractionalPart());
            return ip + fp;
        }

        public static decimal Frac2ClosestMatchFrac(decimal num)
        {
            var target = num.FractionalPart();
            var closest = CommonFracs.Select(n => new {n, distance = Math.Abs(n - target)})
                                     .OrderBy(p => p.distance)
                                     .First().n;
            return closest;
        }
    }
}