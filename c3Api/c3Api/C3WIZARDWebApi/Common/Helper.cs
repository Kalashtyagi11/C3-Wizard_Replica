namespace C3WIZARDWebApi.Common
{
  public static class Helper
  {
    public static string DateFormat
    {
      get
      {
        return "dd/MM/yyyy";
      }
    }
    public static string DisplayDateFormat
    {
      get
      {
        return "dd-MM-yyyy";
      }
    }
    public static string MachineInfo { get { return System.Environment.MachineName; } }
        public static string ReplaceCharacter(string text)
        {
            return text.Replace("'", "");
        }
    }

}
