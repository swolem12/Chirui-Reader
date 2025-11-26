package com.chirui.data.db.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "reading_history")
data class ReadingHistoryEntity(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id")
    val id: Long = 0L,

    @ColumnInfo(name = "manga_id")
    val mangaId: Long,

    @ColumnInfo(name = "chapter_name")
    val chapterName: String,

    @ColumnInfo(name = "last_read_at")
    val lastReadAt: Long,

    @ColumnInfo(name = "last_page_index")
    val lastPageIndex: Int,
)
