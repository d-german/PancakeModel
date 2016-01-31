namespace PancakeModel
{
    public class Eggs
    {
        public static string GetQuantity(int numEggs)
        {
            if (numEggs == 1)
            {
                return "1 egg";
            }

            if (numEggs < 12)
            {
                return string.Format("{0} eggs", numEggs);
            }

            if (numEggs == 12)
            {
                return "1 dozen";
            }

            int numDozen = CalcNumDozen(numEggs);

            int leftover = numEggs%12;

            if (leftover == 0)
            {
                return string.Format("{0} dozen", numDozen);
            }

            if (leftover == 1)
            {
                return string.Format("{0} dozen and 1 egg", numDozen);
            }


            return string.Format("{0} dozen and {1} eggs", numDozen, leftover);
        }

        public static int CalcNumDozen(int numItems)
        {
            if (numItems < 12) return 0;

            if (numItems == 12)
            {
                return 1;
            }

            return numItems/12;
        }
    }
}