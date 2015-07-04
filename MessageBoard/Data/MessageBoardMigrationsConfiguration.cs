using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;

namespace MessageBoard.Data
{
    public class MessageBoardMigrationsConfiguration : DbMigrationsConfiguration<MessageBoardContext>
    {
        public MessageBoardMigrationsConfiguration()
        {
            this.AutomaticMigrationDataLossAllowed = true;
            this.AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(MessageBoardContext context)
        {
            base.Seed(context);

#if DEBUG
            if (context.Topics.Count() == 0)
            {
                var topic1 = new Topic()
                {
                    Title = "What about ASP.NET MVC",
                    Body = "I love ASP.NET MVC and I want everyone to know about it",
                    Created = DateTime.UtcNow,
                    Replies = new List<Reply>()
                    {
                        new Reply() { Body = "Yes it's great actually", Created = DateTime.UtcNow },
                        new Reply() { Body = "Hmm not so sure", Created = DateTime.UtcNow },
                        new Reply() { Body = "Yep it's good", Created = DateTime.UtcNow }
                    }
                };

                var topic2 = new Topic()
                {
                    Title = "Can anyone recommend a good camera?",
                    Body = "I'm a beginner and I'm looking to buy a good DSLR camera",
                    Created = DateTime.UtcNow,
                    Replies = new List<Reply>()
                    {
                        new Reply() { Body = "Got for the Nikon D80", Created = DateTime.UtcNow },
                        new Reply() { Body = "Can't go wrong with a Canon", Created = DateTime.UtcNow },
                        new Reply() { Body = "Canon EOS 350D", Created = DateTime.UtcNow }
                    }
                };

                var topic3 = new Topic()
                {
                    Title = "Electronic drumkit",
                    Body = "I'm a beginner and I'm looking for an electronic drumkit, can anyone recommend a good one?",
                    Created = DateTime.UtcNow
                };

                // Add topics to db
                context.Topics.Add(topic1);
                context.Topics.Add(topic2);
                context.Topics.Add(topic3);

                try 
	            {	        
		            context.SaveChanges();
	            }
	            catch (Exception ex)
	            {
		            var msg = ex.Message;
                    Console.WriteLine("Error during context.SaveChanges:" + msg);
	            }
            }
#endif
        }
    }
}
