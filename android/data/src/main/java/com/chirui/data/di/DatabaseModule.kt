package com.chirui.data.di

import android.content.Context
import androidx.room.Room
import com.chirui.data.db.ChiruiDatabase
import com.chirui.data.db.dao.LibraryMangaDao
import com.chirui.data.db.dao.ReadingHistoryDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): ChiruiDatabase =
        Room.databaseBuilder(
            context,
            ChiruiDatabase::class.java,
            "chirui.db",
        )
            .fallbackToDestructiveMigration()
            .build()

    @Provides
    fun provideLibraryMangaDao(db: ChiruiDatabase): LibraryMangaDao =
        db.libraryMangaDao()

    @Provides
    fun provideReadingHistoryDao(db: ChiruiDatabase): ReadingHistoryDao =
        db.readingHistoryDao()
}
