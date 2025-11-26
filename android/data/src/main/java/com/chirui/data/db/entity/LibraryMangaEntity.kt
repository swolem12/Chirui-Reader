package com.chirui.data.db.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "library_manga")
data class LibraryMangaEntity(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id")
    val id: Long = 0L,

    @ColumnInfo(name = "title")
    val title: String,

    @ColumnInfo(name = "cover_url")
    val coverUrl: String?,

    @ColumnInfo(name = "source_id")
    val sourceId: String,

    @ColumnInfo(name = "in_library_since")
    val inLibrarySince: Long,
)
