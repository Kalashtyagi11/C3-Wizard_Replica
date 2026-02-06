using Newtonsoft.Json;

namespace C3WIZARDWebApi.Common
{
  public class DecimalToStringConverter : JsonConverter
  {
    public override bool CanConvert(Type objectType) =>
        objectType == typeof(decimal) || objectType == typeof(decimal?);

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
      decimal decimalValue = Convert.ToDecimal(value);
      writer.WriteValue(decimalValue.ToString("F2")); // Always show 2 decimal places
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
      if (reader.Value == null) return 0m;
      return Convert.ToDecimal(reader.Value);
    }
  }
}
