namespace CustomerManager.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class DatabaseCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "Customers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        Phone = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("Customers");
        }
    }
}
