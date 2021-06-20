namespace Pomodoro_To_Do_List.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ToDoList
    {
        [Key]
        public int IdTask { get; set; }

        [StringLength(50)]
        public string TaskName { get; set; }

        public byte? TaskPomos { get; set; }

        public string TaskDescription { get; set; }
        public bool Done { get; set; }
    }
}
