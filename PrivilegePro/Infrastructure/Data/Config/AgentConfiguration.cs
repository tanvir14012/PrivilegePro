using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrivilegePro.Models.Core;
using System.Reflection.Emit;

namespace PrivilegePro.Infrastructure.Data.Config
{
    public class AgentConfiguration : IEntityTypeConfiguration<Agent>
    {
        public void Configure(EntityTypeBuilder<Agent> builder)
        {
            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(e => e.Position)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(e => e.Office)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Age)
                .IsRequired();

            builder.Property(e => e.Salary)
                .IsRequired();

            builder.Property(e => e.StartDate)
                .IsRequired();

            builder.Property(e => e.CreatedOnUtc)
                .HasDefaultValueSql("getutcdate()");

            builder.Property(e => e.ModifiedOnUtc)
                .HasDefaultValueSql("getutcdate()");
        }
    }
}
