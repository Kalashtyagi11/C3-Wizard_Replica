using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace C3WizardHelper.ViewModels
{



  [XmlRoot(ElementName = "ExcelWorkbook")]
  public class ExcelWorkbook
  {

    [XmlElement(ElementName = "ActiveSheet")]
    public int ActiveSheet { get; set; }
  }

  [XmlRoot(ElementName = "DocumentProperties")]
  public class DocumentProperties
  {

    [XmlElement(ElementName = "Author")]
    public string Author { get; set; }

    [XmlElement(ElementName = "Created")]
    public DateTime Created { get; set; }

    [XmlElement(ElementName = "LastSaved")]
    public DateTime LastSaved { get; set; }
  }

  //  [XmlRoot(ElementName = "Alignment")]
  //  public class Alignment
  //  {

  //    [XmlAttribute(AttributeName = "Vertical")]
  //    public string Vertical { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Font")]
  //  public class Font
  //  {

  //    [XmlAttribute(AttributeName = "Color")]
  //    public string Color { get; set; }

  //    [XmlAttribute(AttributeName = "FontName")]
  //    public string FontName { get; set; }

  //    [XmlAttribute(AttributeName = "Size")]
  //    public int Size { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Style")]
  //  public class Style
  //  {

  //    [XmlElement(ElementName = "Alignment")]
  //    public Alignment Alignment { get; set; }

  //    [XmlElement(ElementName = "Font")]
  //    public Font Font { get; set; }

  //    [XmlAttribute(AttributeName = "ID")]
  //    public string ID { get; set; }

  //    [XmlAttribute(AttributeName = "Name")]
  //    public string Name { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Styles")]
  //  public class Styles
  //  {

  //    [XmlElement(ElementName = "Style")]
  //    public List<Style> Style { get; set; }
  //  }

  [XmlRoot(ElementName = "Column")]
  public class Column
  {

    [XmlAttribute(AttributeName = "Index")]
    public int Index { get; set; }

    [XmlAttribute(AttributeName = "AutoFitWidth")]
    public int AutoFitWidth { get; set; }

    [XmlAttribute(AttributeName = "Width")]
    public int Width { get; set; }

    [XmlAttribute(AttributeName = "Span")]
    public int Span { get; set; }
  }

  [XmlRoot(ElementName = "Data")]
  public class Data
  {

    [XmlAttribute(AttributeName = "Type")]
    public string Type { get; set; }

    [XmlText]
    public string Text { get; set; }
  }

  [XmlRoot(ElementName = "Cell")]
  public class Cell
  {

    [XmlElement(ElementName = "Data")]
    public Data Data { get; set; }

    [XmlAttribute(AttributeName = "StyleID")]
    public string StyleID { get; set; }

    [XmlText]
    public string Text { get; set; }

    [XmlAttribute(AttributeName = "Index")]
    public int Index { get; set; }
  }

  [XmlRoot(ElementName = "Row")]
  public class Row
  {

    [XmlElement(ElementName = "Cell")]
    public List<Cell> Cell { get; set; }

    [XmlAttribute(AttributeName = "Index")]
    public int Index { get; set; }

    [XmlText]
    public string Text { get; set; }
  }

  [XmlRoot(ElementName = "Table")]
  public class Table
  {

    [XmlElement(ElementName = "Column")]
    public List<Column> Column { get; set; }

    [XmlElement(ElementName = "Row")]
    public List<Row> Row { get; set; }

    [XmlAttribute(AttributeName = "DefaultRowHeight")]
    public int DefaultRowHeight { get; set; }

    [XmlAttribute(AttributeName = "DefaultColumnWidth")]
    public int DefaultColumnWidth { get; set; }

    [XmlAttribute(AttributeName = "ExpandedRowCount")]
    public int ExpandedRowCount { get; set; }

    [XmlAttribute(AttributeName = "ExpandedColumnCount")]
    public int ExpandedColumnCount { get; set; }

    [XmlText]
    public string Text { get; set; }
  }

  //[XmlRoot(ElementName = "Header")]
  //public class Header
  //{

  //  [XmlAttribute(AttributeName = "Margin")]
  //  public double Margin { get; set; }
  //}

  //[XmlRoot(ElementName = "Footer")]
  //public class Footer
  //{

  //  [XmlAttribute(AttributeName = "Margin")]
  //  public double Margin { get; set; }
  //}

  //[XmlRoot(ElementName = "PageMargins")]
  //public class PageMargins
  //{

  //  [XmlAttribute(AttributeName = "Top")]
  //  public double Top { get; set; }

  //  [XmlAttribute(AttributeName = "Bottom")]
  //  public double Bottom { get; set; }

  //  [XmlAttribute(AttributeName = "Left")]
  //  public double Left { get; set; }

  //  [XmlAttribute(AttributeName = "Right")]
  //  public double Right { get; set; }
  //}

  //  [XmlRoot(ElementName = "PageSetup")]
  //  public class PageSetup
  //  {

  //    [XmlElement(ElementName = "Header")]
  //    public Header Header { get; set; }

  //    [XmlElement(ElementName = "Footer")]
  //    public Footer Footer { get; set; }

  //    [XmlElement(ElementName = "PageMargins")]
  //    public PageMargins PageMargins { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Print")]
  //  public class Print
  //  {

  //    [XmlElement(ElementName = "PaperSizeIndex")]
  //    public int PaperSizeIndex { get; set; }

  //    [XmlElement(ElementName = "HorizontalResolution")]
  //    public int HorizontalResolution { get; set; }

  //    [XmlElement(ElementName = "VerticalResolution")]
  //    public int VerticalResolution { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Pane")]
  //  public class Pane
  //  {

  //    [XmlElement(ElementName = "Number")]
  //    public int Number { get; set; }

  //    [XmlElement(ElementName = "RangeSelection")]
  //    public string RangeSelection { get; set; }
  //  }

  //  [XmlRoot(ElementName = "Panes")]
  //  public class Panes
  //  {

  //    [XmlElement(ElementName = "Pane")]
  //    public Pane Pane { get; set; }
  //  }

  //  [XmlRoot(ElementName = "WorksheetOptions")]
  //  public class WorksheetOptions
  //  {

  //    [XmlElement(ElementName = "PageSetup")]
  //    public PageSetup PageSetup { get; set; }

  //    [XmlElement(ElementName = "Print")]
  //    public Print Print { get; set; }

  //    [XmlElement(ElementName = "Panes")]
  //    public Panes Panes { get; set; }

  //    [XmlAttribute(AttributeName = "xmlns")]
  //    public string Xmlns { get; set; }

  //    [XmlText]
  //    public string Text { get; set; }
  //  }

  [XmlRoot(ElementName = "Worksheet")]
  public class Worksheet
  {

    [XmlElement(ElementName = "Names")]
    public object Names { get; set; }

    [XmlElement(ElementName = "Table")]
    public Table Table { get; set; }

    //[XmlElement(ElementName = "WorksheetOptions")]
    //public WorksheetOptions WorksheetOptions { get; set; }

    [XmlAttribute(AttributeName = "Name")]
    public string Name { get; set; }

    [XmlText]
    public string Text { get; set; }
  }

  //  [XmlRoot(ElementName = "Workbook")]
  //  public class MenuItems
  //{

  //    [XmlElement(ElementName = "ExcelWorkbook")]
  //    public ExcelWorkbook ExcelWorkbook { get; set; }

  //    [XmlElement(ElementName = "DocumentProperties")]
  //    public DocumentProperties DocumentProperties { get; set; }

  //    [XmlElement(ElementName = "Styles")]
  //    public Styles Styles { get; set; }

  //    [XmlElement(ElementName = "Worksheet")]
  //    public List<Worksheet> Worksheet { get; set; }

  //    [XmlAttribute(AttributeName = "o")]
  //    public string O { get; set; }

  //    [XmlAttribute(AttributeName = "x")]
  //    public string X { get; set; }

  //    [XmlAttribute(AttributeName = "ss")]
  //    public string Ss { get; set; }

  //    [XmlAttribute(AttributeName = "xmlns")]
  //    public string Xmlns { get; set; }

  //    [XmlAttribute(AttributeName = "x2")]
  //    public string X2 { get; set; }

  //    [XmlAttribute(AttributeName = "html")]
  //    public string Html { get; set; }

  //    [XmlAttribute(AttributeName = "dt")]
  //    public string Dt { get; set; }

  //    [XmlText]
  //    public string Text { get; set; }
  //  }



  [XmlRoot(ElementName = "Workbook", Namespace = "urn:schemas-microsoft-com:office:spreadsheet")]
  public class MenuItemsXml
  {
    [XmlElement(ElementName = "ExcelWorkbook", Namespace = "urn:schemas-microsoft-com:office:excel")]
    public ExcelWorkbook ExcelWorkbook { get; set; }

    [XmlElement(ElementName = "DocumentProperties", Namespace = "urn:schemas-microsoft-com:office:office")]
    public DocumentProperties DocumentProperties { get; set; }

    //[XmlElement(ElementName = "Styles")]
    //public Styles Styles { get; set; }

    [XmlElement(ElementName = "Worksheet")]
    public List<Worksheet> Worksheet { get; set; }
  }


  public class MenuItem
  {
    public int Id { get; set; }
    public int roleId { get; set; }
    public int userId { get; set; }
    public string? title { get; set; }
        public string? Description { get; set; }
        public string? href { get; set; }
    public string? icon { get; set; }
    public bool collapisble { get; set; }
    public int Order { get; set; }
    public int? ParentId { get; set; }
    public int? IsActive { get; set; }
    public List<MenuItem>? children { get; set; } = new();

    public bool AddPermission { get; set; }
    public bool UpdatePermission { get; set; }
    public bool DeletePermission { get; set; }
    public bool ViewPermission { get; set; }
    public bool Is_Print { get; set; }
    public bool Is_Submitted { get; set; }
    public bool Is_preview { get; set; }
    public bool Is_pay { get; set; }
    public bool Is_wages { get; set; }
    
    public int? Level { get; set; }

  }

  public class CompanyPaymentStatus
  {
    public string CompanyName { get; set; }
    public string PaymentStatus { get; set; } 
    public string CompanyLogo { get; set; }
    public string PeriodMonth { get; set; }
    public string year { get; set; }
    public int totalNoEmp { get; set; }
    public int schduleNo { get; set; }
    public decimal Paid { get; set; }
    public string Types { get; set; }
    public decimal Unpaid { get; set; }
    public int paidEmployer { get; set; }
    public int unPaidEmployer { get; set; }
  }
  public class DashboardSummary
  {
    public string PeriodMonth { get; set; }  
    public string Types { get; set; }
    public string year { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalUnpaid { get; set; }
    public decimal unpaidPercentage { get; set; }
    public decimal paidPercentage { get; set; }
    public int paidEmployer { get; set; }
    public int unPaidEmployer { get; set; }

  }
  public class AdminDashboardResponse
  {
    public List<DashboardSummary>? Summary { get; set; }
    public List<CompanyPaymentStatus>? selfSummary { get; set; }
    public List<CompanyPaymentStatus>? CompanyPaymentStatus { get; set; }
  }
}