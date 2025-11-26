package com.chirui.data.db

import androidx.room.Database
import androidx.room.RoomDatabase
import com.chirui.data.db.dao.LibraryMangaDao
import com.chirui.data.db.dao.ReadingHistoryDao
import com.chirui.data.db.entity.LibraryMangaEntity
import com.chirui.data.db.entity.ReadingHistoryEntity

@Database(
    entities = [
        LibraryMangaEntity::class,
        ReadingHistoryEntity::class,
    ],
    version = 1,
    exportSchema = false,
)
abstract class ChiruiDatabase : RoomDatabase() {

    abstract fun libraryMangaDao(): LibraryMangaDao

    abstract fun readingHistoryDao(): ReadingHistoryDao
}
