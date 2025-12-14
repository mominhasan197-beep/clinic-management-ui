using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Services
{
    public interface IPdfService
    {
        byte[] GeneratePatientHistoryPdf(PatientHistoryResponse patientHistory);
        byte[] GenerateAppointmentHistoryPdf(PatientAppointmentHistoryResponse history);
    }

    public class PdfService : IPdfService
    {
        public PdfService()
        {
            // Set QuestPDF license
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] GeneratePatientHistoryPdf(PatientHistoryResponse patientHistory)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .Text("Patient Medical History")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(x =>
                        {
                            x.Spacing(20);

                            // Patient Details
                            x.Item().Text("Patient Information").SemiBold().FontSize(16);
                            x.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
                            
                            if (patientHistory.Patient != null)
                            {
                                x.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Name: {patientHistory.Patient.Name}");
                                    row.RelativeItem().Text($"Age: {patientHistory.Patient.Age}");
                                });
                                x.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Mobile: {patientHistory.Patient.Mobile}");
                                    row.RelativeItem().Text($"Blood Group: {patientHistory.Patient.BloodGroup}");
                                });
                            }

                            // Visit History
                            x.Item().PaddingTop(20).Text("Visit History").SemiBold().FontSize(16);
                            x.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                            x.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(80);
                                    columns.ConstantColumn(60);
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Date");
                                    header.Cell().Element(CellStyle).Text("Time");
                                    header.Cell().Element(CellStyle).Text("Doctor");
                                    header.Cell().Element(CellStyle).Text("Diagnosis");
                                    header.Cell().Element(CellStyle).Text("Treatment");
                                    header.Cell().Element(CellStyle).Text("Notes");

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                    }
                                });

                                foreach (var visit in patientHistory.History)
                                {
                                    table.Cell().Element(CellStyle).Text(visit.VisitDate);
                                    table.Cell().Element(CellStyle).Text(visit.VisitTime);
                                    table.Cell().Element(CellStyle).Text(visit.DoctorName);
                                    table.Cell().Element(CellStyle).Text(visit.Diagnosis ?? "-");
                                    table.Cell().Element(CellStyle).Text(visit.Treatment ?? "-");
                                    table.Cell().Element(CellStyle).Text(visit.Notes ?? "-");

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                    }
                                }
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Generated on ");
                            x.Span(DateTime.Now.ToString("dd MMM yyyy HH:mm")).SemiBold();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateAppointmentHistoryPdf(PatientAppointmentHistoryResponse history)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .Text("Patient Appointment History")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(x =>
                        {
                            x.Spacing(20);

                            // Patient
                            x.Item().Text("Patient Information").SemiBold().FontSize(16);
                            x.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                            if (history.Patient != null)
                            {
                                x.Item().Row(row => {
                                    row.RelativeItem().Text($"Name: {history.Patient.Name}");
                                    row.RelativeItem().Text($"Mobile: {history.Patient.Mobile}");
                                });
                                x.Item().Row(row => {
                                    row.RelativeItem().Text($"Email: {history.Patient.Email ?? "-"}");
                                    row.RelativeItem().Text($"Age: {history.Patient.Age?.ToString() ?? "-"}");
                                });
                            }

                            // Appointments
                            x.Item().PaddingTop(20).Text("Appointments").SemiBold().FontSize(16);
                            x.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                            x.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(70); // Date
                                    columns.ConstantColumn(55); // Time
                                    columns.RelativeColumn();   // Doctor
                                    columns.RelativeColumn();   // Location
                                    columns.RelativeColumn();   // Diagnosis
                                    columns.RelativeColumn();   // Treatment
                                    columns.ConstantColumn(60); // Fees
                                });
                                
                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Date");
                                    header.Cell().Element(CellStyle).Text("Time");
                                    header.Cell().Element(CellStyle).Text("Doctor");
                                    header.Cell().Element(CellStyle).Text("Location");
                                    header.Cell().Element(CellStyle).Text("Diagnosis");
                                    header.Cell().Element(CellStyle).Text("Treatment");
                                    header.Cell().Element(CellStyle).Text("Fees");
                                    
                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                    }
                                });

                                foreach (var app in history.Appointments)
                                {
                                    table.Cell().Element(CellStyle).Text(app.AppointmentDate);
                                    table.Cell().Element(CellStyle).Text(app.AppointmentTime);
                                    table.Cell().Element(CellStyle).Text(app.DoctorName);
                                    table.Cell().Element(CellStyle).Text(app.LocationName);
                                    table.Cell().Element(CellStyle).Text(app.Diagnosis ?? "-");
                                    table.Cell().Element(CellStyle).Text(app.Treatment ?? "-");
                                    table.Cell().Element(CellStyle).Text(app.Fees?.ToString("C") ?? "-");

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                    }
                                }
                            });
                        });
                        
                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Generated on ");
                            x.Span(DateTime.Now.ToString("dd MMM yyyy HH:mm")).SemiBold();
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}
